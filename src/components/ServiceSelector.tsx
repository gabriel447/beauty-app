import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'

type Props = {
  value: Service | null
  onChange: (service: Service) => void
}

export default function ServiceSelector({ value, onChange }: Props) {
  const [services, setServices] = useState<Service[]>([])
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('services').select('*').order('name')
      setServices(data || [])
    }
    load()
  }, [])
  return (
    <View>
      <FlatList
        data={services}
        keyExtractor={(s) => String(s.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: value?.id === item.id ? '#fff1f5' : '#ffffff' }}
            onPress={() => onChange(item)}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
            <Text style={{ color: '#4b5563' }}>{Math.round(item.duration_min)} min</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}