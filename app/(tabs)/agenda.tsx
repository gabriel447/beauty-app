import { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions, Image, Modal, TextInput, Platform, ActionSheetIOS, Animated, Easing, DeviceEventEmitter, AppState } from 'react-native'
import { supabase } from '@/lib/supabase'
import { AvailabilitySlot, Professional, Service } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
 

export default function AgendaTab() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selected, setSelected] = useState<Professional | null>(null)
  const [monthCursor, setMonthCursor] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [servicesMap, setServicesMap] = useState<Record<string, Service>>({})
  const [openSelector, setOpenSelector] = useState<boolean>(false)
  const [favSet, setFavSet] = useState<Set<string>>(new Set())
  const [favServiceSet, setFavServiceSet] = useState<Set<string>>(new Set())
  const [bookingsBySlot, setBookingsBySlot] = useState<Record<string, any>>({})
  const [mockSlotsByProfDate, setMockSlotsByProfDate] = useState<Record<string, AvailabilitySlot[]>>({})
  const [mockServiceBySlot, setMockServiceBySlot] = useState<Record<string, string>>({})
  const [pendingReserve, setPendingReserve] = useState<AvailabilitySlot | null>(null)
  const [reserveService, setReserveService] = useState<Service | null>(null)
  const [reserveName, setReserveName] = useState('')
  const [reserveEmail, setReserveEmail] = useState('')
  const [reservePhone, setReservePhone] = useState('')
  const [openServiceSelector, setOpenServiceSelector] = useState<boolean>(false)
  const modalAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (pendingReserve) {
      modalAnim.setValue(0)
      Animated.timing(modalAnim, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
    }
  }, [pendingReserve])
  const closeModal = () => {
    Animated.timing(modalAnim, { toValue: 0, duration: 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => setPendingReserve(null))
  }
  const modalAnimatedStyle = {
    transform: [{ translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    opacity: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
  }
  
  const availableServices = useMemo(() => {
    const items = Object.values(servicesMap)
    const filtered = items.filter((s) => (selected?.specialties || []).includes(s.name))
    const list = filtered.length > 0 ? filtered : items
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [servicesMap, selected?.id, selected?.specialties])
  const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
  const promoPriceCents = (s: Service) => {
    const hasPromo = (s.tags || []).includes('promocao')
    const discount = hasPromo ? 0.2 : 0 // 20% padrão
    return Math.round(s.price_cents * (1 - discount))
  }
  
  
  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, '')
    const d = digits.slice(0, 11)
    const part1 = d.slice(0, 2)
    const part2 = d.length > 6 ? d.slice(2, 7) : d.slice(2)
    const part3 = d.length > 6 ? d.slice(7) : ''
    return d.length <= 2 ? part1 : d.length <= 7 ? `(${part1}) ${part2}` : `(${part1}) ${part2}-${part3}`
  }
  const onPhoneChange = (t: string) => setReservePhone(formatPhone(t))
  const isEmailValid = (e: string) => /.+@.+\..+/.test(e)
  const BUSINESS_START_HOUR = 8
  const BUSINESS_END_HOUR = 20

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('professionals').select('*')
      const raw = await AsyncStorage.getItem('favorites_professionals')
      const favs = new Set(((raw ? JSON.parse(raw) : []) as string[]).map(String))
      setFavSet(favs)
      try {
        const rawSvc = await AsyncStorage.getItem('favorites_services')
        const svcFavs = new Set(((rawSvc ? JSON.parse(rawSvc) : []) as string[]).map(String))
        setFavServiceSet(svcFavs)
      } catch {}
      const rows = (data || []) as Professional[]
      rows.sort((a, b) => {
        const fa = favs.has(String(a.id)) ? 0 : 1
        const fb = favs.has(String(b.id)) ? 0 : 1
        if (fa !== fb) return fa - fb
        return a.name.localeCompare(b.name)
      })
      setProfessionals(rows)
      if (!selected && rows.length > 0) setSelected(rows[0])
    }
    load()
  }, [])

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('favorites_professionals_updated', async () => {
      try {
        const raw = await AsyncStorage.getItem('favorites_professionals')
        const favs = new Set(((raw ? JSON.parse(raw) : []) as string[]).map(String))
        setFavSet(favs)
        setProfessionals((prev) => {
          const rows = [...prev]
          rows.sort((a, b) => {
            const fa = favs.has(String(a.id)) ? 0 : 1
            const fb = favs.has(String(b.id)) ? 0 : 1
            if (fa !== fb) return fa - fb
            return a.name.localeCompare(b.name)
          })
          return rows
        })
      } catch {}
    })
    return () => sub.remove()
  }, [])

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        try {
          const raw = await AsyncStorage.getItem('favorites_professionals')
          const favs = new Set(((raw ? JSON.parse(raw) : []) as string[]).map(String))
          setFavSet(favs)
          setProfessionals((prev) => {
            const rows = [...prev]
            rows.sort((a, b) => {
              const fa = favs.has(String(a.id)) ? 0 : 1
              const fb = favs.has(String(b.id)) ? 0 : 1
              if (fa !== fb) return fa - fb
              return a.name.localeCompare(b.name)
            })
            return rows
          })
        } catch {}
      }
    })
    return () => sub.remove()
  }, [])

  useEffect(() => {
    const loadServices = async () => {
      const { data } = await supabase.from('services').select('*')
      const map: Record<string, Service> = {};
      (data || []).forEach((s: any) => { map[String(s.id)] = s as Service })
      setServicesMap(map)
    }
    loadServices()
  }, [])

  useEffect(() => {
    if (!pendingReserve) return
    const firstFav = availableServices.find((s) => favServiceSet.has(String(s.id)))
    if (firstFav) setReserveService(firstFav)
  }, [pendingReserve, availableServices, favServiceSet])

  useEffect(() => {
    if (professionals.length === 0 || Object.keys(servicesMap).length === 0) return
    const today = new Date(); today.setHours(0,0,0,0)
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
    const serviceList = Object.values(servicesMap)
    const nextMockSlots: Record<string, AvailabilitySlot[]> = {}
    const nextMockNames: Record<string, string> = {}
    professionals.forEach((p) => {
      ;[today, tomorrow].forEach((d) => {
        const key = `${p.id}:${d.toDateString()}`
        const blocks: AvailabilitySlot[] = []
        const freeHours = new Set<number>()
        while (freeHours.size < 3) {
          freeHours.add(Math.floor(Math.random() * (BUSINESS_END_HOUR - BUSINESS_START_HOUR)) + BUSINESS_START_HOUR)
        }
        for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
          const start = new Date(d); start.setHours(h, 0, 0, 0)
          const end = new Date(d); end.setHours(h + 1, 0, 0, 0)
          const isFree = freeHours.has(h)
          const id = `mock-${p.id}-${start.toISOString()}`
          const status: AvailabilitySlot['status'] = isFree ? 'available' : 'reserved'
          blocks.push({ id, professional_id: p.id, start_time: start.toISOString(), end_time: end.toISOString(), status })
          if (!isFree && serviceList.length > 0) {
            const svc = serviceList[Math.floor(Math.random() * serviceList.length)]
            nextMockNames[id] = svc.name
          }
        }
        nextMockSlots[key] = blocks
      })
    })
    setMockSlotsByProfDate(nextMockSlots)
    setMockServiceBySlot(nextMockNames)
  }, [professionals, servicesMap])

  useEffect(() => {
    if (!selected) return
    const loadSlots = async () => {
      const { data } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('professional_id', selected.id)
        .gte('start_time', new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0).toISOString())
      .lte('start_time', new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59).toISOString())
      .order('start_time')
      setSlots((data || []) as AvailabilitySlot[])
    }
    loadSlots()
    const channel = supabase
      .channel(`agenda_${selected.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability_slots', filter: `professional_id=eq.${selected.id}` }, (payload: any) => {
        setSlots((prev) => {
          const next = [...prev]
          const newSlot = payload.new as any
          const oldSlot = payload.old as any
          if (payload.eventType === 'INSERT') {
            const d = new Date(newSlot.start_time)
            if (d.toDateString() === selectedDate.toDateString()) next.push(newSlot)
          } else if (payload.eventType === 'UPDATE') {
            const idx = next.findIndex((s) => s.id === newSlot.id)
            if (idx >= 0) next[idx] = newSlot
          } else if (payload.eventType === 'DELETE') {
            return next.filter((s) => s.id !== oldSlot?.id)
          }
          return next.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        })
      })
    channel.subscribe()
    return () => { channel.unsubscribe() }
  }, [selected, selectedDate])

  useEffect(() => {
    if (slots.length === 0) { setBookingsBySlot({}); return }
    const loadBookings = async () => {
      const ids = slots.map((s) => s.id)
      const { data } = await supabase
        .from('bookings')
        .select('id, service_id, slot_id, status')
        .in('slot_id', ids)
      const map: Record<string, any> = {}
      ;(data || []).forEach((b: any) => { map[String(b.slot_id)] = b })
      setBookingsBySlot(map)
    }
    loadBookings()
  }, [slots])

  const monthName = useMemo(() => monthCursor.toLocaleString('pt-BR', { month: 'long' }), [monthCursor])
  const year = monthCursor.getFullYear()
  const firstDay = new Date(year, monthCursor.getMonth(), 1)
  const startWeekday = firstDay.getDay() // 0-6
  const daysInMonth = new Date(year, monthCursor.getMonth() + 1, 0).getDate()
  const daysArray = Array.from({ length: startWeekday + daysInMonth }, (_, i) => i < startWeekday ? null : i - startWeekday + 1)

  const upcomingForSelectedDay = useMemo(() => {
    return slots
      .filter((s) => new Date(s.start_time).toDateString() === selectedDate.toDateString())
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  }, [slots, selectedDate])

  const eventsBusinessHours = useMemo(() => {
    return upcomingForSelectedDay.filter((ev) => {
      const h = new Date(ev.start_time).getHours()
      return h >= BUSINESS_START_HOUR && h < BUSINESS_END_HOUR
    })
  }, [upcomingForSelectedDay])

  const displayEvents = useMemo(() => {
    if (!selected) return []
    const key = `${selected.id}:${selectedDate.toDateString()}`
    if (eventsBusinessHours.length === 0) {
      const mock = mockSlotsByProfDate[key]
      if (mock && mock.length > 0) return mock
      return []
    }
    const blocks: AvailabilitySlot[] = []
    for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
      const start = new Date(selectedDate); start.setHours(h, 0, 0, 0)
      const end = new Date(selectedDate); end.setHours(h + 1, 0, 0, 0)
      const slot = eventsBusinessHours.find((s) => {
        const d = new Date(s.start_time)
        return d.getFullYear() === selectedDate.getFullYear() && d.getMonth() === selectedDate.getMonth() && d.getDate() === selectedDate.getDate() && d.getHours() === h
      })
      if (slot) {
        blocks.push(slot)
      } else {
        blocks.push({
          id: `free-${selected.id}-${start.toISOString()}`,
          professional_id: selected.id,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          status: 'available',
        })
      }
    }
    return blocks
  }, [eventsBusinessHours, selected?.id, selectedDate, mockSlotsByProfDate])

  const visibleEvents = useMemo(() => {
    return [...displayEvents].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  }, [displayEvents])

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => setOpenSelector((v) => !v)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center' }}>
          {selected ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={{ marginRight: 8, color: favSet.has(String(selected.id)) ? '#f59e0b' : '#9ca3af' }}>★</Text>
              {selected.avatar_url ? (
                <Image source={typeof selected.avatar_url === 'number' ? selected.avatar_url : { uri: selected.avatar_url }} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }} />
              ) : (
                <View style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: '#e5e7eb' }} />
              )}
              <Text style={{ fontWeight: '600', color: '#111827', flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail">{selected.name}</Text>
              <View style={{ marginLeft: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#fde7f3', borderRadius: 999 }}>
                <Text style={{ color: '#ec4899', fontWeight: '600' }}>{(selected.rating ?? 0).toFixed(1)}</Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: '#6b7280', flex: 1 }}>Selecione</Text>
          )}
          <Text style={{ color: '#ec4899' }}>{openSelector ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {openSelector && (
          <View style={{ marginTop: 8, maxHeight: Math.min(300, Math.round(Dimensions.get('window').height * 0.45)), borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            <FlatList
              data={professionals.filter((p) => String(p.id) !== String(selected?.id))}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const fav = favSet.has(String(item.id))
                const avatarSource = item.avatar_url
                  ? typeof item.avatar_url === 'number'
                    ? item.avatar_url
                    : { uri: item.avatar_url }
                  : undefined
                return (
                  <TouchableOpacity
                    onPress={() => { setSelected(item); setOpenSelector(false) }}
                    style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' }}
                  >
                    <Text style={{ marginRight: 8, color: fav ? '#f59e0b' : '#9ca3af' }}>★</Text>
                    {avatarSource ? (
                      <Image source={avatarSource} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
                    ) : (
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#e5e7eb', marginRight: 8 }} />
                    )}
                    <Text style={{ fontSize: 14, color: '#111827', flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#fde7f3', borderRadius: 999 }}>
                      <Text style={{ color: '#ec4899', fontWeight: '600' }}>★ {(item.rating ?? 0).toFixed(1)}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
              initialNumToRender={12}
              windowSize={5}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => setMonthCursor(new Date(year, monthCursor.getMonth() - 1, 1))}>
              <Text style={{ fontSize: 18, color: '#ec4899' }}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 12, fontSize: 16, fontWeight: '600', textTransform: 'capitalize' }}>{monthName} {year}</Text>
            <TouchableOpacity onPress={() => setMonthCursor(new Date(year, monthCursor.getMonth() + 1, 1))}>
              <Text style={{ fontSize: 18, color: '#ec4899' }}>{'›'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, idx) => (
              <Text key={`${d}-${idx}`} style={{ width: '14.285%', textAlign: 'center', color: '#6b7280' }}>{d}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {daysArray.map((day, idx) => day === null ? (
              <View key={idx} style={{ width: '14.285%', height: 36 }} />
            ) : (
              <TouchableOpacity key={idx} style={{ width: '14.285%', height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: selectedDate.getDate() === day && selectedDate.getMonth() === monthCursor.getMonth() ? '#f9a8d4' : 'transparent' }} onPress={() => setSelectedDate(new Date(year, monthCursor.getMonth(), day))}>
                <Text style={{ color: '#111827' }}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 16, paddingTop: 12, paddingHorizontal: 16, backgroundColor: '#f3f4f6', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#111827', fontWeight: '700' }}>Eventos</Text>
          </View>
          {(!selected) ? (
            <Text style={{ color: '#111827' }}>Nenhum evento para o dia selecionado</Text>
          ) : (
            (() => {
              if (visibleEvents.length === 0) {
                const isToday = new Date().toDateString() === selectedDate.toDateString()
                const onOpenQuickReserve = () => {
                  if (!selected) return
                  const start = new Date(selectedDate); start.setHours(12, 0, 0, 0)
                  const end = new Date(selectedDate); end.setHours(13, 0, 0, 0)
                  setPendingReserve({ id: `free-${selected.id}-${start.toISOString()}`, professional_id: selected.id, start_time: start.toISOString(), end_time: end.toISOString(), status: 'available' })
                  setReserveService(null); setReserveName(''); setReserveEmail(''); setReservePhone('')
                }
                return (
                  <View>
                    <Text style={{ color: '#6b7280' }}>{isToday ? 'Não temos nada agendado para hoje ainda.' : 'Não temos nada agendado ainda para o dia selecionado.'}</Text>
                    <TouchableOpacity onPress={onOpenQuickReserve} style={{ marginTop: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#ec4899', borderRadius: 8, alignSelf: 'flex-start' }}>
                      <Text style={{ color: '#ffffff', fontWeight: '600' }}>Agendar horário</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
              return (
                <FlatList
                data={visibleEvents}
                keyExtractor={(ev) => String(ev.id)}
                renderItem={({ item: ev }) => {
                  const start = new Date(ev.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  const end = new Date(ev.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  const status = ev.status
                  const booking = bookingsBySlot[String(ev.id)]
                  const isFree = (!booking && status !== 'blocked' && status !== 'reserved')
                  const isMock = String(ev.id).startsWith('mock')
                  const mockName = isMock ? mockServiceBySlot[String(ev.id)] : undefined
                  const serviceName = booking
                    ? (servicesMap[String(booking.service_id)]?.name || 'Reservado')
                    : (status === 'blocked' ? 'Bloqueado' : (mockName || 'Livre'))
                  const leftColor = status === 'blocked' ? '#991b1b' : '#111827'
                  const cardBg = isFree ? '#fde7f3' : (status === 'blocked' ? '#fee2e2' : '#ffffff')
                  const cardBorder = isFree ? '#fbcfe8' : (status === 'blocked' ? '#fca5a5' : (booking ? '#fce7f3' : '#e5e7eb'))
                  const timeChipBg = isFree ? '#fde7f3' : 'transparent'
                  const timeChipColor = isFree ? '#ec4899' : '#374151'
                  return (
                    <TouchableOpacity disabled={!isFree} activeOpacity={1} onPress={() => { setPendingReserve(ev); setReserveService(null); setReserveName(''); setReserveEmail(''); setReservePhone('') }} style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: leftColor, fontSize: 13, flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail">{serviceName}</Text>
                      </View>
                      <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: timeChipBg }}>
                        <Text style={{ color: timeChipColor, fontSize: 12 }}>{start} às {end}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                ListEmptyComponent={<Text style={{ color: '#111827' }}>Nenhum evento para o dia selecionado</Text>}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
              />
              )
            })()
          )}
        </View>
        <Modal visible={!!pendingReserve} transparent animationType="none" onRequestClose={closeModal}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={[{ width: '92%', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, position: 'relative' }, modalAnimatedStyle]}>
              {pendingReserve && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>Agendar horário</Text>
                  <Text style={{ color: '#6b7280' }}>das {new Date(pendingReserve.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às {new Date(pendingReserve.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              )}
              <View style={{ marginBottom: 8 }}>
                <Text>Serviço</Text>
                <View style={{ marginTop: 6 }}>
                  <FlatList
                    data={availableServices}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setReserveService(item)}
                        style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' }}
                      >
                        <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#ec4899', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                          {reserveService?.id === item.id && (
                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ec4899' }} />
                          )}
                        </View>
                        <Text style={{ color: '#111827', flex: 1 }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                          {favServiceSet.has(String(item.id)) && (
                            <View style={{ marginRight: 6, backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                              <Text style={{ color: '#f59e0b', fontSize: 12 }}>★</Text>
                            </View>
                          )}
                          {((item.tags || []).includes('promocao')) ? (
                            <>
                              <View style={{ marginRight: 6, backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                                <Text style={{ color: '#6b7280', fontSize: 12, textDecorationLine: 'line-through' }}>{formatCurrency(item.price_cents)}</Text>
                              </View>
                              <View style={{ backgroundColor: '#fde7f3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                                <Text style={{ color: '#ec4899', fontSize: 12 }}>{formatCurrency(promoPriceCents(item))}</Text>
                              </View>
                            </>
                          ) : (
                            <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                              <Text style={{ color: '#6b7280', fontSize: 12 }}>{formatCurrency(item.price_cents)}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                    style={{ maxHeight: 220 }}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
              <View style={{ marginBottom: 8 }}>
                <Text>Nome completo</Text>
                <TextInput value={reserveName} onChangeText={setReserveName} style={{ height: 36, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 }} />
              </View>
              <View style={{ marginBottom: 8 }}>
                <Text>Email</Text>
                <TextInput value={reserveEmail} onChangeText={setReserveEmail} keyboardType="email-address" autoCapitalize="none" style={{ height: 36, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 }} />
              </View>
              <View style={{ marginBottom: 8 }}>
                <Text>Telefone</Text>
                <TextInput value={reservePhone} onChangeText={onPhoneChange} keyboardType="phone-pad" style={{ height: 36, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 }} />
              </View>
              {(() => {
                const matched = reserveService
                const valid = Boolean(matched && reserveName.trim().length >= 3 && isEmailValid(reserveEmail) && reservePhone.replace(/\D/g, '').length >= 10)
                const onMark = async () => {
                  try {
                    if (!pendingReserve || !matched || !selected) return
                    await supabase.from('bookings').insert({
                      service_id: matched.id,
                      professional_id: selected.id,
                      slot_id: pendingReserve.id,
                      status: 'confirmed',
                    })
                    closeModal()
                  } catch {}
                }
                return (
                  <View>
                    <TouchableOpacity disabled={!valid} onPress={onMark} style={{ marginTop: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: valid ? '#ec4899' : '#fde7f3', borderRadius: 10 }}>
                      <Text style={{ color: valid ? '#ffffff' : '#ec4899', fontWeight: '600', textAlign: 'center' }}>Agendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal} style={{ marginTop: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 10 }}>
                      <Text style={{ color: '#111827', textAlign: 'center' }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )
              })()}
            </Animated.View>
          </View>
        </Modal>
      </View>
    </View>
  )
}