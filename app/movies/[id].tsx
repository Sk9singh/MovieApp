import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovieDetails } from '@/services/api'
import { icons } from '@/constants/icons'

interface movieInfoProps {
    label: string;
    value: string | number | null | undefined;
}

const MovieInfo = ({ label, value }: movieInfoProps) => (
   <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 text-sm font-normal'>{label}</Text>
    <Text className='text-light-300 font-bold text-sm mt-1'>{value ?? 'N/A'}</Text>
   </View>
)

const MoviesDetails = () => {
   const { id } = useLocalSearchParams()

   const {data: movie, loading} = useFetch(()=> fetchMovieDetails(id as string))

  return (
    <View className='bg-dark-100 flex-1'>
       <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className='w-full h-[550px]' resizeMode='stretch'/>
            </View>
            <View className='flex-col items-start justify-center px-5 mt-5'>
              <Text className='text-white text-xl font-bold'>{movie?.title}</Text>
              <View className='flex-row items-center gap-x-1 mt-2'>
                <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
                <Text className='text-light-200 text-sm'>|</Text>
                <Text className='text-light-200 text-sm'>{movie?.runtime} min</Text>
              </View>
              <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
                <Image source={icons.star} className='size-4' />
                <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
                <Text className='text-light-200 text-sm'>({movie?.vote_count} votes)</Text>
              </View>
              <View>
                 <MovieInfo label="Overview" value={movie?.overview} />
                 <MovieInfo label="Genres" value={movie?.genres?.map((g)=>g.name).join(' - ') || 'N/A'} />
                  <View className='flex flex-row justify-between w-1/2'>
                    <MovieInfo label="Budget" value={movie?.budget ? `$${Math.round(movie.budget/1_000_000)} million` : 'N/A'} />
                    <MovieInfo label="Revenue" value={movie?.revenue ? `$${Math.round(movie.revenue/1_000_000)} million` : 'N/A'} />
                  </View>
                  <MovieInfo label="Production Companies" value={movie?.production_companies?.map((c) => c.name).join(' - ') || 'N/A'} />
                  <MovieInfo label="Spoken Languages" value={movie?.spoken_languages?.map((l) => l.name).join(' || ') || 'N/A'} />
                  <MovieInfo label="Status" value={movie?.status} />
              </View>
            </View>
            <TouchableOpacity className='absolute top-[600px] right-10  bg-gray-600 p-3 rounded-full' onPress={() => console.log('Save to Watchlist')}>
              <Image source={icons.save} className='size-6' tintColor="#ffff" />
            </TouchableOpacity>
            
        </ScrollView>
          <TouchableOpacity className='absolute bottom-5 left-0 right-0 mx-5 flex-row items-center bg-accent py-3.5 rounded-lg justify-center z-50' onPress={router.back}>
            <Image source={icons.arrow} className='mr-1 mt-0.5 rotate-180 size-5' tintColor="#ffff" />
            <Text className='text-white font-semibold text-base'>Go Back</Text>
          </TouchableOpacity>
          
    </View>
  )
}

export default MoviesDetails