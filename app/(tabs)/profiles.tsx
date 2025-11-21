import { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { professionals } from '@/lib/demoData'
import ProfessionalCard from '@/components/ProfessionalCard'
import { Professional } from '@/types'

export default function Profiles() {
  const [data, setData] = useState<Professional[]>([])
  useEffect(() => {
    setData(professionals as any)
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