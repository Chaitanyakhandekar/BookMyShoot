import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Star, 
  MapPin, 
  Users, 
  Filter, 
  Search, 
  Heart, 
  Award, 
  Clock, 
  DollarSign,
  Grid,
  List,
  ChevronDown,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BrowsePhotographers() {
  const [photographers, setPhotographers] = useState([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  
  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: '',
    specialty: '',
    location: '',
    priceRange: '',
    rating: '',
    sortBy: 'rating'
  });

  // Navigation handler - replace with your routing logic
  const navigateToPhotographer = (photographerId) => {
    console.log(`Navigate to photographer profile: ${photographerId}`);
    // Add your navigation logic here
    // For example: window.location.href = `/photographer/${photographerId}`;
  };

  // Mock data - replace with actual API call
  const mockPhotographers = [
    {
      id: 1,
      name: 'Arjun Sharma',
      specialty: 'Wedding Photography',
      specialties: ['Wedding', 'Portrait'],
      rating: 4.9,
      reviews: 127,
      pricePerDay: 25000,
      location: 'Mumbai',
      verified: true,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop'
      ],
      bio: 'Professional wedding photographer with 10+ years of experience capturing beautiful moments.',
      equipment: ['Canon EOS R5', 'Sony A7III', 'Professional Lighting'],
      languages: ['Hindi', 'English', 'Marathi'],
      responseTime: '2 hours',
      completedProjects: 450
    },
    {
      id: 2,
      name: 'Priya Patel',
      specialty: 'Fashion & Portrait',
      specialties: ['Fashion', 'Portrait', 'Commercial'],
      rating: 4.8,
      reviews: 89,
      pricePerDay: 18000,
      location: 'Delhi',
      verified: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b630?w=150&h=150&fit=crop&crop=face',
      portfolio: [
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop'
      ],
      bio: 'Creative fashion and lifestyle photographer with a passion for storytelling through images.',
      equipment: ['Nikon D850', 'Fujifilm GFX 100S', 'Studio Equipment'],
      languages: ['Hindi', 'English', 'Gujarati'],
      responseTime: '1 hour',
      completedProjects: 320
    },
    {
      id: 3,
      name: 'Rohit Kumar',
      specialty: 'Corporate Events',
      specialties: ['Corporate', 'Events', 'Conference'],
      rating: 4.7,
      reviews: 156,
      pricePerDay: 22000,
      location: 'Bangalore',
      verified: true,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      portfolio: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'
      ],
      bio: 'Corporate event specialist with expertise in conferences, product launches, and business photography.',
      equipment: ['Canon EOS 5D Mark IV', 'Sony FX3', 'Wireless Flash System'],
      languages: ['English', 'Hindi', 'Kannada'],
      responseTime: '3 hours',
      completedProjects: 280
    },
    {
      id: 4,
      name: 'Anjali Singh',
      specialty: 'Baby & Family',
      specialties: ['Family', 'Baby', 'Maternity'],
      rating: 4.9,
      reviews: 203,
      pricePerDay: 15000,
      location: 'Pune',
      verified: true,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      portfolio: [
        'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&h=300&fit=crop'
      ],
      bio: 'Specialized in capturing precious family moments and milestones with a gentle, patient approach.',
      equipment: ['Canon EOS R6', 'Natural Light Setup', 'Soft Box Lighting'],
      languages: ['Hindi', 'English', 'Marathi'],
      responseTime: '1 hour',
      completedProjects: 380
    },
    {
      id: 5,
      name: 'Vikram Reddy',
      specialty: 'Food & Product',
      specialties: ['Food', 'Product', 'Commercial'],
      rating: 4.6,
      reviews: 94,
      pricePerDay: 20000,
      location: 'Hyderabad',
      verified: true,
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      portfolio: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop'
      ],
      bio: 'Food and product photography expert helping restaurants and brands showcase their offerings.',
      equipment: ['Sony A7R IV', 'Macro Lenses', 'Professional Lighting Kit'],
      languages: ['Telugu', 'English', 'Hindi'],
      responseTime: '4 hours',
      completedProjects: 210
    },
    {
      id: 6,
      name: 'Maya Joshi',
      specialty: 'Travel & Lifestyle',
      specialties: ['Travel', 'Lifestyle', 'Nature'],
      rating: 4.8,
      reviews: 167,
      pricePerDay: 16000,
      location: 'Goa',
      verified: true,
      profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      portfolio: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73d1e?w=400&h=300&fit=crop'
      ],
      bio: 'Adventure and lifestyle photographer capturing the beauty of destinations and authentic moments.',
      equipment: ['Canon EOS R', 'DJI Mavic Pro', 'Weather-sealed Gear'],
      languages: ['English', 'Hindi', 'Konkani'],
      responseTime: '2 hours',
      completedProjects: 195
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadPhotographers = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPhotographers(mockPhotographers);
      setFilteredPhotographers(mockPhotographers);
      setLoading(false);
    };

    loadPhotographers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, photographers]);

  const applyFilters = () => {
    let filtered = [...photographers];

    // Search query
    if (filters.searchQuery) {
      filtered = filtered.filter(photographer =>
        photographer.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        photographer.specialty.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        photographer.location.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (filters.specialty) {
      filtered = filtered.filter(photographer =>
        photographer.specialties.includes(filters.specialty)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(photographer =>
        photographer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(photographer =>
        photographer.pricePerDay >= min && photographer.pricePerDay <= max
      );
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(photographer =>
        photographer.rating >= parseFloat(filters.rating)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.pricePerDay - b.pricePerDay;
        case 'price-high':
          return b.pricePerDay - a.pricePerDay;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredPhotographers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      specialty: '',
      location: '',
      priceRange: '',
      rating: '',
      sortBy: 'rating'
    });
  };

  const PhotographerCard = ({ photographer, viewMode }) => {
    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <img
                src={photographer.portfolio[0]}
                alt={photographer.name}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{photographer.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={photographer.profileImage}
                    alt={photographer.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-purple-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{photographer.name}</h3>
                      {photographer.verified && (
                        <Award className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-purple-600 font-medium">{photographer.specialty}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {photographer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {photographer.reviews} reviews
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {photographer.responseTime} response
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{photographer.pricePerDay.toLocaleString()}
                    <span className="text-sm text-gray-500">/day</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{photographer.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {photographer.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {photographer.completedProjects} projects completed
                </div>
                <div className="flex gap-2">
                  <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                    View Portfolio
                  </button>
                  <button 
                    onClick={() => navigateToPhotographer(photographer.id)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={photographer.portfolio[0]}
            alt={photographer.specialty}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{photographer.rating}</span>
            </div>
          </div>
          {photographer.verified && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={photographer.profileImage}
              alt={photographer.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-purple-100"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{photographer.name}</h3>
              <p className="text-purple-600 font-medium">{photographer.specialty}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {photographer.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {photographer.reviews} reviews
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {photographer.specialties.slice(0, 2).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {specialty}
              </span>
            ))}
            {photographer.specialties.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{photographer.specialties.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-gray-900">
              ₹{photographer.pricePerDay.toLocaleString()}
              <span className="text-sm text-gray-500">/day</span>
            </div>
            <div className="text-sm text-gray-600">
              {photographer.responseTime} response
            </div>
          </div>

          <button 
            onClick={() => {
              navigate(`/photographers/id`);
              localStorage.setItem('photographer', JSON.stringify(photographer));
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            View Profile & Book
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photographers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Photographers</h1>
              <p className="text-gray-600 mt-2">
                {filteredPhotographers.length} photographers available
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search photographers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    />
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.specialty}
                    onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  >
                    <option value="">All Specialties</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Events">Events</option>
                    <option value="Family">Family</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (per day)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  >
                    <option value="">Any Price</option>
                    <option value="0-15000">Under ₹15,000</option>
                    <option value="15000-25000">₹15,000 - ₹25,000</option>
                    <option value="25000-35000">₹25,000 - ₹35,000</option>
                    <option value="35000-999999">Above ₹35,000</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5★ & above</option>
                    <option value="4.0">4.0★ & above</option>
                    <option value="3.5">3.5★ & above</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredPhotographers.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No photographers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-6'
              }>
                {filteredPhotographers.map((photographer) => (
                  <PhotographerCard
                    key={photographer.id}
                    photographer={photographer}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-xl overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {/* Mobile filters content - same as sidebar */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}