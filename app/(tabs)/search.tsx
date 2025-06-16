import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import SearchBar from "@/components/searchBar";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import MovieCard from "@/components/movieCard";
import { useState, useEffect } from "react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: movies,
          loading: moviesLoading,
          error: moviesError,
          refetch: refetchMovies,
          reset
  } = useFetch(() => fetchMovies({ 
          query: searchQuery 
        }),false);
        
        useEffect(() => {
          const delay = async () => {
            if (searchQuery.trim()) {
              await refetchMovies();
            } else {
              reset();
            }
          };
          // Debounce the search query to avoid too many requests
          const timeoutId = setTimeout(delay, 1500);   // Adjust the delay 
          return () => clearTimeout(timeoutId); 
          
        },[searchQuery]);

 
  return (
    
    <View className="flex-1 bg-dark-200" >
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />
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
                  justifyContent: 'center',
                  marginBottom: 10,
                  gap: 16,
                  marginVertical: 16
                }}
                className="px-5"
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                  <>
                     <View className="flex-row w-full items-center justify-center mt-5">
                        <Image source={icons.logo} className="w-12 h-10 mb-5" />
                     </View>
                     <View className="my-5">
                        <SearchBar 
                             placeholder="Search Movies..."
                             value={searchQuery}
                             onChangeText = {(text: string) => setSearchQuery(text)} 
                           />
                     </View>
                        { moviesLoading && (
                            <ActivityIndicator size="large" color="#0000ff" className="my-3" />
                          )}

                           { moviesError && (
                            <Text className="text-red-500 px-5 my-3">Error : {moviesError.message}</Text>
                     )}
                          
                          { !moviesLoading && !moviesError && searchQuery.trim() && movies?.length>0 && (
                            <Text className="text-xl text-white font-bold">
                              Search Results for {' '}
                              <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                          )}
                  </>
                }
                ListEmptyComponent={
                  !moviesLoading && !moviesError ? (
                    <View className="mt-10 px-5">
                        <Text className="text-gray-500 text-center">
                          {searchQuery.trim() ?
                            `No Results found`
                            : "Search for a movie"}
                        </Text>
                    </View>
                  ) : null
                }
                
           />
     
    </View>
  );
}
