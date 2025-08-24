// Mock users for testing without MongoDB
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdCRrIyCR3Rkzm6', // password123
    role: 'user',
    phone: '+1234567890',
    avatar: '',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdCRrIyCR3Rkzm6', // password123
    role: 'photographer',
    phone: '+1234567891',
    avatar: '',
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@photoweb.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdCRrIyCR3Rkzm6', // password123
    role: 'admin',
    phone: '+1234567892',
    avatar: '',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdCRrIyCR3Rkzm6', // password123
    role: 'photographer',
    phone: '+1234567893',
    avatar: '',
    isActive: true,
    createdAt: new Date('2024-01-20')
  }
];

// Mock photographers for testing
const photographers = [
  {
    id: '1',
    user: '2',
    businessName: 'Jane Smith Photography',
    bio: 'Professional wedding and portrait photographer with 10+ years of experience. Specializing in capturing life\'s most precious moments with artistic flair.',
    specializations: ['Wedding', 'Portrait', 'Event'],
    location: 'New York, NY',
    pricing: 1500,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    portfolio: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a',
      'https://images.unsplash.com/photo-1519741497674-611481863552'
    ],
    equipment: ['Canon 5D Mark IV', 'Canon 24-70mm f/2.8', 'Canon 85mm f/1.4', 'Professional Lighting Kit'],
    experience: 10,
    socialLinks: {
      instagram: '@janesmithphoto',
      facebook: 'JaneSmithPhotography',
      website: 'https://janesmithphoto.com'
    },
    isVerified: true,
    rating: 4.8,
    totalReviews: 45,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    user: '4',
    businessName: 'Mike Johnson Studios',
    bio: 'Creative commercial and fashion photographer. Expert in studio and outdoor shoots with a focus on modern, clean aesthetics.',
    specializations: ['Commercial', 'Fashion', 'Product'],
    location: 'Los Angeles, CA',
    pricing: 2000,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'
    ],
    equipment: ['Sony A7R IV', 'Sony 24-70mm f/2.8', 'Sony 85mm f/1.4', 'Studio Strobes', 'Modifiers'],
    experience: 8,
    socialLinks: {
      instagram: '@mikejohnsonstudios',
      website: 'https://mikejohnsonstudios.com'
    },
    isVerified: true,
    rating: 4.6,
    totalReviews: 28,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    user: '5',
    businessName: 'Sarah Wilson Photography',
    bio: 'Destination wedding photographer capturing love stories around the world. Available for travel worldwide.',
    specializations: ['Wedding', 'Destination', 'Couple'],
    location: 'Miami, FL',
    pricing: 3000,
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    portfolio: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866',
      'https://images.unsplash.com/photo-1519741497674-611481863552',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6'
    ],
    equipment: ['Nikon D850', 'Nikon 24-70mm f/2.8', 'Nikon 70-200mm f/2.8', 'Drone'],
    experience: 12,
    socialLinks: {
      instagram: '@sarahwilsonweddings',
      website: 'https://sarahwilsonweddings.com'
    },
    isVerified: false,
    rating: 0,
    totalReviews: 0,
    createdAt: new Date('2024-02-01')
  }
];

// Mock bookings for testing
const bookings = [
  {
    id: '1',
    user: '1',
    photographer: '1',
    eventType: 'Wedding',
    eventDate: new Date('2024-06-15'),
    startTime: '14:00',
    endTime: '22:00',
    location: 'Central Park, New York',
    guestCount: 150,
    additionalRequests: 'Include engagement photos session before the wedding',
    budget: 1500,
    status: 'confirmed',
    createdAt: new Date('2024-02-10')
  },
  {
    id: '2',
    user: '1',
    photographer: '2',
    eventType: 'Corporate Event',
    eventDate: new Date('2024-04-20'),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Business Center, Los Angeles',
    guestCount: 200,
    additionalRequests: 'Professional headshots for all executives',
    budget: 2000,
    status: 'pending',
    createdAt: new Date('2024-02-15')
  },
  {
    id: '3',
    user: '6',
    photographer: '1',
    eventType: 'Portrait Session',
    eventDate: new Date('2024-03-10'),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Studio, New York',
    guestCount: 4,
    additionalRequests: 'Family portraits with children',
    budget: 500,
    status: 'completed',
    createdAt: new Date('2024-01-25')
  }
];

// Mock reviews for testing
const reviews = [
  {
    id: '1',
    user: '6',
    photographer: '1',
    booking: '3',
    rating: 5,
    comment: 'Jane was absolutely amazing! She captured our family perfectly and made everyone feel comfortable. The photos turned out better than we could have imagined.',
    createdAt: new Date('2024-03-12')
  },
  {
    id: '2',
    user: '7',
    photographer: '1',
    booking: '4',
    rating: 4,
    comment: 'Great photographer with excellent technical skills. Very professional and delivered photos on time. Would definitely recommend!',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    user: '8',
    photographer: '2',
    booking: '5',
    rating: 5,
    comment: 'Mike\'s commercial photography is top-notch. He understood our brand vision perfectly and delivered stunning product shots.',
    createdAt: new Date('2024-02-28')
  }
];

module.exports = {
  users,
  photographers,
  bookings,
  reviews
};
