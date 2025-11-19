import { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { supabase } from '@/lib/supabase'
import ProfessionalCard from '@/components/ProfessionalCard'
import { Professional } from '@/types'

export default function Profiles() {
  const [data, setData] = useState<Professional[]>([])
  useEffect(() => {
    const load = async () => {
      const { data: rows } = await supabase.from('professionals').select('*')
      setData(rows || [])
    }
    load()
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProfessionalCard professional={item} />}
      />
    </View>
  )
}