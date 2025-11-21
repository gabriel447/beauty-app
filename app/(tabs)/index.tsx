import { View, ImageBackground, Text, SafeAreaView, Image } from 'react-native'

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827' }}>Início</Text>
          <Image source={require('../../imgs/logo.png')} style={{ height: 40, width: 100, resizeMode: 'contain' }} />
        </View>
      </SafeAreaView>
      <ImageBackground source={require('../../imgs/main.jpg')} style={{ flex: 1 }} resizeMode="cover">
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
          <Text style={{ color: '#f472b6', fontSize: 26, fontWeight: '800', textAlign: 'center' }}>Seu salão na palma da mão</Text>
          <Text style={{ color: '#ffffff', fontSize: 18, lineHeight: 28, marginTop: 12, textAlign: 'center' }}>Veja a agenda do seu profissional favorito e agende um horário rapidamente. </Text>
        </View>
      </ImageBackground>
    </View>
  )
}