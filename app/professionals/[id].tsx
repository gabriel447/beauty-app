import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator, Text } from 'react-native'
import { professionals } from '@/lib/demoData'
import { Professional } from '@/types'
import ProfessionalProfile from '@/components/ProfessionalProfile'

export default function ProfessionalPage() {
  const params = useLocalSearchParams<{ id?: string | string[] }>()
  const [professional, setProfessional] = useState<Professional | null>(null)
  useEffect(() => {
    const idParam = Array.isArray(params.id) ? params.id[0] : params.id
    const p = (professionals as any).find((x: any) => String(x.id) === String(idParam)) || (professionals as any)[0] || null
    setProfessional(p)
  }, [params.id])
  if (!professional) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator />
      <Text style={{ marginTop: 8, color: '#6b7280' }}>Carregando profissional…</Text>
    </View>
  )
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ProfessionalProfile professional={professional} />
    </View>
  )
}