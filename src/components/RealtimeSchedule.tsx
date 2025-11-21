import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { availability_slots } from '@/lib/demoData'
import { AvailabilitySlot } from '@/types'

type Props = {
  professionalId: string
  onSelectSlot?: (slot: AvailabilitySlot) => void
}

export default function RealtimeSchedule({ professionalId, onSelectSlot }: Props) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  useEffect(() => {
    const now = new Date()
    const data = availability_slots
      .filter((s) => String(s.professional_id) === String(professionalId))
      .filter((s) => new Date(s.start_time).getTime() >= now.getTime())
      .slice(0, 100)
    setSlots(data as any)
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
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {slots.map((s) => (
        <View key={String(s.id)} style={{ width: '33.333%' }}>
          {renderItem({ item: s })}
        </View>
      ))}
    </View>
  )
}