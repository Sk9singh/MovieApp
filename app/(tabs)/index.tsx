import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import MovieCard from "@/components/movieCard";

export default function Index() {
  const router = useRouter();

  const { data: movies,
          loading: moviesLoading,
          error: moviesError,
  } = useFetch(() => fetchMovies({ 
          query: '' 
        }));

 
  return (
    <View className="flex-1 bg-dark-200" >
      <Image source={images.bg} className="absolute w-full z-0"/>
      
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: '100%' }}>
          <Image source={icons.logo} className="w-12 h-10 mb-5 mt-5 mx-auto" />
           
             { moviesLoading ? (
              <ActivityIndicator 
                size="large"
                color="#0000ff"
                className="mt-10 self-center" />
              ) : moviesError ? (
              <Text>Error : {moviesError.message}</Text>
              ) : (
                  <View className="flex-1 mt-5">
           <>
           <Text className="text-lg text-white mt-5 mb-3 font-bold">Latest Movies</Text>
           <FlatList 
                data={movies}
                renderItem={({ item }) => (
                  <MovieCard 
                     {...item}
                  />
                )}
                keyExtractor={(item) => item.id.toString()} 
                numColumns={3}
                columnWrapperStyle={{ 
                  justifyContent: 'flex-start',
                  marginBottom: 10,
                  gap: 20,
                  paddingRight: 5
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
           />
           </>
        </View>
              )}
      
        </ScrollView>
     
    </View>
  );
}
