import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { supabase } from '@/lib/supabase'
import { AvailabilitySlot } from '@/types'

type Props = {
  professionalId: string
  onSelectSlot?: (slot: AvailabilitySlot) => void
}

export default function RealtimeSchedule({ professionalId, onSelectSlot }: Props) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('professional_id', professionalId)
        .gte('start_time', new Date().toISOString())
        .limit(100)
      setSlots(data || [])
    }
    load()
    const channel = supabase
      .channel(`availability_slots_${professionalId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability_slots', filter: `professional_id=eq.${professionalId}` }, (payload: any) => {
        setSlots((prev) => {
          const next = [...prev]
          const idx = next.findIndex((s) => s.id === (payload.new as any)?.id)
          if (payload.eventType === 'INSERT') next.unshift(payload.new as any)
          else if (payload.eventType === 'UPDATE' && idx >= 0) next[idx] = payload.new as any
          else if (payload.eventType === 'DELETE') return prev.filter((s) => s.id !== (payload.old as any)?.id)
          return next
        })
      })
    channel.subscribe()
    return () => {
      channel.unsubscribe()
    }
  }, [professionalId])

  const renderItem = ({ item }: { item: AvailabilitySlot }) => {
    const start = new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const end = new Date(item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const disabled = item.status !== 'available'
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onSelectSlot?.(item)}
        style={{ padding: 12, marginRight: 8, marginBottom: 8, borderRadius: 8, backgroundColor: disabled ? '#e5e7eb' : '#ec4899' }}
      >
        <Text style={{ color: disabled ? '#4b5563' : '#ffffff' }}>
          {start} - {end}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <FlatList
        data={slots}
        keyExtractor={(s) => String(s.id)}
        numColumns={3}
        renderItem={renderItem}
      />
    </View>
  )
}