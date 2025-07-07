interface Movie {
  id: number;
  title: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}


interface ChatUser {
  id: string;
  username: string;
}

interface ChatRoom {
  _id: string;
  user1: ChatUser;
  user2: ChatUser;
  lastMessage: string;
  lastMessageTime: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  _id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isMovieShare: boolean;
  movieId?: number;
  isRealTime?: boolean;
}

interface CreateChatRoomData {
  otherUserId: string;
  otherUsername: string;
}

interface SendMessageData {
  chatRoomId: string;
  message: string;
  movieId?: string;
}

interface SearchUserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// WebSocket Events
interface WebSocketEvents {
  connected: { message: string; userId: string; joinedRooms: string[] };
  newMessage: ChatMessage;
  userOnline: { userId: string; fullName: string; roomId: string };
  userOffline: { userId: string; fullName: string; roomId: string };
  userTyping: { userId: string; fullName: string; roomId: string; isTyping: boolean };
  joinedRoom: { roomId: string; message: string };
  error: { message: string };
}