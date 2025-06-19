import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { getWishList } from '@/services/wishlistApi'
import { useAuth } from '@/hooks/useAuth'

interface WishlistMovie {
  movieId: number;
  posterPath: string;
  title: string;
  releaseDate: string;
}

const Saved = () => {
  const [movies, setMovies] = useState<WishlistMovie[]>([])
  
  const { getUserId } = useAuth()
  const userId = getUserId()
  
  // FIXED: Refresh data whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        loadMovies()
      }
    }, [userId])
  )

  const loadMovies = async () => {
    if (!userId) return
    
    try {
      const data = await getWishList(userId)
      setMovies(data)
    } catch (error) {
      console.error('Error loading movies:', error)
    }
  }

  const renderMovie = ({ item }: { item: WishlistMovie }) => (
    <TouchableOpacity 
      className='bg-dark-200 rounded-lg p-4 mb-4 flex-row'
      onPress={() => router.push(`/movies/${item.movieId}`)}
    >
      <Image 
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }}
        className='w-20 h-28 rounded-lg mr-4'
      />
      <View className='flex-1'>
        <Text className='text-white text-lg font-bold' numberOfLines={2}>
          {item.title}
        </Text>
        <Text className='text-light-200 text-sm mt-2'>
          {item.releaseDate?.split('-')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (!userId || movies.length === 0) {
    return <View className='flex-1 bg-dark-100' />
  }

  return (
    <View className='flex-1 bg-dark-100'>
      <Text className='text-white text-2xl font-bold p-4'>Saved Movies</Text>
      <Text className='text-light-200 text-sm px-4 mb-4'>You have {movies.length} movies in your wishlist.</Text>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.movieId.toString()}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  )
}

export default Saved