import { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Professional, Service } from '@/types'

type Props = {
  professional: Professional
  servicesByName: Record<string, Service>
  onSelect: (service: Service, professional: Professional) => void
}

export default function ProfessionalAccordion({ professional, servicesByName, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false)
  const avatarSource = professional.avatar_url
    ? typeof professional.avatar_url === 'number'
      ? professional.avatar_url
      : { uri: professional.avatar_url }
    : undefined

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
      >
        {avatarSource ? (
          <Image source={avatarSource} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
        ) : (
          <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#e5e7eb' }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{professional.name}</Text>
          <Text style={{ color: '#6b7280' }} numberOfLines={1}>{professional.specialties?.join(', ')}</Text>
        </View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#fde7f3', borderRadius: 6 }}>
          <Text style={{ color: '#be185d' }}>{professional.rating ?? 0}★</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          {professional.specialties?.map((name) => {
            const svc = servicesByName[name]
            return (
              <TouchableOpacity
                key={name}
                onPress={() => svc && onSelect(svc, professional)}
                style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text style={{ fontSize: 15 }}>{name}</Text>
                {svc ? (
                  <Text style={{ color: '#6b7280' }}>{Math.round(svc.duration_min)} min • R$ {(svc.price_cents / 100).toFixed(0)}</Text>
                ) : (
                  <Text style={{ color: '#6b7280' }}>—</Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}