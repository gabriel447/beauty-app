import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { Professional, Service, AvailabilitySlot } from '@/types'
import ServiceSelector from '@/components/ServiceSelector'
import RealtimeSchedule from '@/components/RealtimeSchedule'
import ProfessionalCard from '@/components/ProfessionalCard'

export default function BookingFlow() {
  const [step, setStep] = useState<number>(1)
  const [service, setService] = useState<Service | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [showServices, setShowServices] = useState<boolean>(false)

  useEffect(() => {
    const loadSlots = async () => {
      if (!professional) return
      const { data } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('professional_id', professional.id)
        .gte('start_time', new Date().toISOString())
        .limit(50)
      setSlots(data || [])
    }
    loadSlots()
  }, [professional])

  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [favProfessionals, setFavProfessionals] = useState<Set<string>>(new Set())
  useEffect(() => {
    const loadProfessionals = async () => {
      let query = supabase.from('professionals').select('*')
      if (service) {
        query = query.contains('specialties', [service.name])
      }
      const { data } = await query
      const rows = (data || []) as Professional[]
      const raw = await AsyncStorage.getItem('favorites_professionals')
      const arr: string[] = raw ? JSON.parse(raw) : []
      const favs = new Set(arr.map(String))
      setFavProfessionals(favs)
      rows.sort((a, b) => {
        const fa = favs.has(String(a.id)) ? 0 : 1
        const fb = favs.has(String(b.id)) ? 0 : 1
        if (fa !== fb) return fa - fb
        return a.name.localeCompare(b.name)
      })
      setProfessionals(rows)
    }
    loadProfessionals()
  }, [service])

  const onConfirmSlot = async (slot: AvailabilitySlot) => {
    if (!service || !professional) return
    await supabase.from('bookings').insert({
      service_id: service.id,
      professional_id: professional.id,
      slot_id: slot.id,
      status: 'confirmed',
    })
  }

  return (
    <View style={{ flex: 1 }}>
      {step === 1 && (
        <ImageBackground source={require('../../imgs/2150771294.jpg')} style={{ flex: 1 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} />
                  <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16 }}>
              {!showServices && (
                <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#ec4899', borderRadius: 12, alignSelf: 'flex-start' }} onPress={() => setShowServices(true)}>
                  <Text style={{ color: '#ffffff', fontWeight: '600' }}>Escolher serviço</Text>
                </TouchableOpacity>
              )}
              {showServices && (
                <ServiceSelector value={service} onChange={(s) => { setService(s); setShowServices(false); setStep(2) }} />
              )}
            </View>
          </View>
        </ImageBackground>
      )}
          {step === 2 && (
            <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Escolha o profissional</Text>
        <FlatList
          data={professionals}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProfessionalCard
              professional={item}
              showFavorite={false}
              onPress={() => { setProfessional(item); setStep(3) }}
            />
          )}
        />
              <TouchableOpacity style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 8 }} onPress={() => setStep(1)}>
                <Text>Voltar</Text>
              </TouchableOpacity>
            </View>
          )}
      {step === 3 && professional && (
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>Confirmar horário</Text>
          <RealtimeSchedule professionalId={professional.id} onSelectSlot={onConfirmSlot} />
          <TouchableOpacity style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 8 }} onPress={() => setStep(2)}>
            <Text>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
