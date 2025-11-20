import { View, Text, Image, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Professional, PortfolioItem, Review, Service } from '@/types'
import RealtimeSchedule from '@/components/RealtimeSchedule'

type Props = { professional: Professional }

export default function ProfessionalProfile({ professional }: Props) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [services, setServices] = useState<Service[]>([])
  useEffect(() => {
    const load = async () => {
      const { data: pf } = await supabase.from('portfolios').select('*').eq('professional_id', professional.id)
      const { data: rv } = await supabase.from('reviews').select('*').eq('professional_id', professional.id)
      const { data: sv } = await supabase.from('services').select('*')
      const svFiltered = (sv || []).filter((s: any) => (professional.specialties || []).includes(s.name))
      setPortfolio(pf || [])
      setReviews(rv || [])
      setServices(svFiltered as any)
    }
    load()
  }, [professional.id])
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        {professional.avatar_url ? (
          <Image source={typeof professional.avatar_url === 'number' ? professional.avatar_url : { uri: professional.avatar_url }} style={{ width: 96, height: 96, borderRadius: 48 }} />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb' }} />
        )}
        <Text style={{ fontSize: 24, fontWeight: '600', marginTop: 12 }}>{professional.name}</Text>
        <Text style={{ color: '#374151', marginTop: 4 }}>{professional.bio}</Text>
        <Text style={{ color: '#4b5563', marginTop: 8 }}>Especialidades: {professional.specialties?.join(', ')}</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Serviços</Text>
        {services.map((s) => (
          <View key={String(s.id)} style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16 }}>{s.name}</Text>
            <Text style={{ color: '#6b7280' }}>{Math.round(s.duration_min)} min</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Portfólio</Text>
        <FlatList
          horizontal
          data={portfolio}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <Image source={typeof item.image_url === 'number' ? item.image_url : { uri: item.image_url }} style={{ width: 160, height: 160, marginRight: 12, borderRadius: 12 }} />
          )}
        />
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Avaliações</Text>
        <FlatList
          data={reviews}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: '500' }}>{item.rating}★</Text>
              <Text style={{ color: '#374151' }}>{item.comment}</Text>
            </View>
          )}
        />
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Agenda</Text>
        <RealtimeSchedule professionalId={professional.id} />
      </View>
    </View>
  )
}