import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Professional } from '@/types'
import ProfessionalProfile from '@/components/ProfessionalProfile'

export default function ProfessionalPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [professional, setProfessional] = useState<Professional | null>(null)
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('professionals').select('*').eq('id', id).single()
      setProfessional(data as any)
    }
    load()
  }, [id])
  if (!professional) return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator />
    </View>
  )
  return (
    <View className="flex-1 bg-white">
      <ProfessionalProfile professional={professional} />
    </View>
  )
}