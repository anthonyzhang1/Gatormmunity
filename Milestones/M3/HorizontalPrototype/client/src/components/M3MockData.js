export const userRoles = [
	{ value: '0', description: "Unapproved User"},
	{ value: '1', description: "Approved User"},
	{ value: '2', description: "Moderator"},
	{ value: '3', description: "Administrator"},
];

/** Mock users. */
export const mockUsers = [
	{
		user_id: 100,
		full_name: "Katla Larchica",
		email: "klarchica22@mail.sfsu.edu",
		profile_picture_path: "/images/m3_data/katla.jpg",
		profile_picture_thumbnail_path: "/images/m3_data/katla.jpg",
		role: 1,
		join_date: "2022-11-01 15:45:00"
	}, {
		user_id: 101,
		full_name: "Vladislav Artemiev",
		email: "vartemiev5@mail.sfsu.edu",
		profile_picture_path: "/images/m3_data/vladislav.png",
		profile_picture_thumbnail_path: "/images/m3_data/vladislav.png",
		role: 1,
		join_date: "2022-11-02 15:30:00"
	}, {
		user_id: 102,
		full_name: "Logix Ficsario",
		email: "lficsario1@mail.sfsu.edu",
		profile_picture_path: "/images/m3_data/logy.png",
		profile_picture_thumbnail_path: "/images/m3_data/logy.png",
		role: 1,
		join_date: "2022-11-03 10:00:00"
	}, {
		user_id: 103,
		full_name: "Florian Cartozo",
		email: "fcartozo11@sfsu.edu",
		profile_picture_path: "/images/about/Florian.png",
		profile_picture_thumbnail_path: "/images/about/Florian.png",
		role: 3,
		join_date: "2022-11-04 02:15:00"
	}, {
		user_id: 104,
		full_name: "Mohamed Sharif",
		email: "msharif90@mail.sfsu.edu",
		profile_picture_path: "/images/about/Mohamed.png",
		profile_picture_thumbnail_path: "/images/about/Mohamed.png",
		role: 3,
		join_date: "2022-11-04 02:42:00"
	}, {
		user_id: 105,
		full_name: "Jose Lopez",
		email: "jlopez08@mail.sfsu.edu",
		profile_picture_path: "/images/about/Jose.png",
		profile_picture_thumbnail_path: "/images/about/Jose.png",
		role: 3,
		join_date: "2022-11-04 03:18:00"
	}, {
		user_id: 106,
		full_name: "Marwan Alnounou",
		email: "malnounou60@mail.sfsu.edu",
		profile_picture_path: "/images/about/Marwan.png",
		profile_picture_thumbnail_path: "/images/about/Marwan.png",
		role: 3,
		join_date: "2022-11-04 03:55:00"
	}, {
		user_id: 107,
		full_name: "Hatsune Miku",
		email: "hmiku@sfsu.edu",
		profile_picture_path: "/images/m3_data/mikudayo.png",
		profile_picture_thumbnail_path: "/images/m3_data/mikudayo.png",
		role: 2,
		join_date: "2022-11-05 18:00:00"
	}
]

/** The options for a listing's category. */
export const listingCategories = [
	"Miscellaneous",
	"Educational",
	"Electronics",
	"Entertainment",
	"Services"
];

/** Mock listing data for the marketplace. */
export const mockListings = [
	{
		"listing_id": 0,
		"description": "Very good game tbh",
		"name": "Overwatch 2",
		"category": "Entertainment",
		"price": "50",
		"picture": "/images/m3_data/overwatch_2.png",
		"author_id": 104
	}, {
		"listing_id": 1,
		"description": "The phone is very good quality",
		"name": "iPhone 12 Mini",
		"category": "Electronics",
		"price": "499.99",
		"picture": "/images/m3_data/iphone_12.jpg",
		"author_id": 106
	}, {
		"listing_id": 2,
		"description": "M1 Chip, 8 GB RAM, 256 GB Storage, new condition",
		"name": "MacBook Pro 13 inch",
		"category": "Electronics",
		"price": "1199.99",
		"picture": "/images/m3_data/macbook.jpg",
		"author_id": 103
	}, {
		"listing_id": 3,
		"description": "Game of Thrones: Season 1 (BD) [Blu-ray]",
		"name": "Game of Thrones S1",
		"category": "Entertainment",
		"price": "16",
		"picture": "/images/m3_data/game_of_thrones.jpg",
		"author_id": 100
	}, {
		"listing_id": 4,
		"description": "The Hitchhiker's Guide to the Galaxy",
		"name": "The Hitchhiker's Guide to the Galaxy",
		"category": "Entertainment",
		"price": "10.99",
		"picture": "/images/m3_data/hitchhiker_guide.jpg",
		"author_id": 105
	}, {
		"listing_id": 5,
		"description": "i hate this book, please take it off of my hands",
		"name": "Calculus: Early Transcendentals",
		"category": "Educational",
		"price": "120",
		"picture": "/images/m3_data/calculus.jpg",
		"author_id": 107
	}, {
		"listing_id": 6,
		"description": "I have a BS in Math. I can help you for $20/hr.",
		"name": "Math Tutoring",
		"category": "Services",
		"price": "20",
		"picture": "/images/m3_data/euler.png",
		"author_id": 101
	}, {
		"listing_id": 7,
		"description": "I have a MS in Math. I can help you for $18/hr! Much better deal than that other person!",
		"name": "Math Tutoring (better deal!)",
		"category": "Services",
		"price": "18",
		"picture": "/images/about/Florian.png",
		"author_id": 103
	}, {
		"listing_id": 8,
		"description": "Excellent soap and the box is in perfect condition.",
		"name": "Dove Soap",
		"category": "Miscellaneous",
		"price": "2",
		"picture": "/images/m3_data/soap.png",
		"author_id": 101
	}, {
		"listing_id": 9,
		"description": "Red IKEA chair for kids.",
		"name": "Red Chair for Kids",
		"category": "Miscellaneous",
		"price": "25",
		"picture": "/images/m3_data/chair.png",
		"author_id": 107
	}
];

export const mockGroups = [
	{
		group_id: 0,
		name: "Chess Club @ SFSU",
		description:
			`We love to play chess. Feel free to message any of our members for a game or two!

			Rules:
			No cheating.
			No toxicity.
			Have fun!`,
		picture_path: "/images/m3_data/chess.jpg",
		picture_thumbnail_path: "/images/m3_data/chess.jpg",
		admin_id: 102,
		announcement:
			`Hello everyone, as you may know, cheating in chess is strictly forbidden in this club.\
			After the recent debacle involving Magnus Carlsen and Hans Niemann, any supporters of Hans Niemann\
			will find themselves removed from this group.

			Thank you for your understanding!`,
		member_ids: [100, 105],
		moderator_ids: [],
	}, {
		group_id: 1,
		name: "Gatormmunity Fan Club",
		description:
			`Hi all, this is a fan club for Gatormmunity. Let's all get along!`,
		picture_path: "/images/m3_data/hearts.png",
		picture_thumbnail_path: "/images/m3_data/hearts.png",
		admin_id: 107,
		announcement:
			``,
		member_ids: [100, 101, 102, 103, 104],
		moderator_ids: [105, 106],
	}, {
		group_id: 2,
		name: "Fans of Game of Thrones",
		description:
			`We love Game of Thrones. Let's watch an episode or two together!`,
		picture_path: "/images/m3_data/game_of_thrones.jpg",
		picture_thumbnail_path: "/images/m3_data/game_of_thrones.jpg",
		admin_id: 106,
		announcement:
			`Hello everyone, as you may know, spoiling is very bad!\
			Please don't spoil when you are watching an episode!`,
		member_ids: [100, 101],
		moderator_ids: [103, 105],
	}
];

/** The options for a thread's category. */
export const threadCategories = [
	"General",
	"Social",
	"Questions"
];

/** Mock threads for the forums. */
export const mockThreads = [
	{
		thread_id: 0,
		author_id: 100,
		title: "Chess Discussion",
		date: "11/01/2022, 16:20",
		num_posts: 3,
		category: "General",
		group_id: 0
	}, {
		thread_id: 1,
		author_id: 102,
		title: "Pizza Party @ CS Lab Tonight",
		date: "11/02/2022, 10:00",
		num_posts: 1,
		category: "Social",
		group_id: null
	}, {
		thread_id: 2,
		author_id: 101,
		title: "Chess Opening Theory",
		date: "11/02/2022, 11:10",
		num_posts: 2,
		category: "General",
		group_id: 0
	}, {
		thread_id: 3,
		author_id: 101,
		title: "Anyone down for some games?",
		date: "11/04/2022, 01:00",
		num_posts: 3,
		category: "Social",
		group_id: 0
	}, {
		thread_id: 4,
		author_id: 102,
		title: "How to solve this calculus problem? Please hurry!",
		date: "11/05/2022, 23:10",
		num_posts: 1,
		category: "Questions",
		group_id: null
	}, {
		thread_id: 5,
		author_id: 101,
		title: "Need help with astrology homework.",
		date: "11/05/2022, 23:25",
		num_posts: 2,
		category: "Questions",
		group_id: null
	}, {
		thread_id: 6,
		author_id: 100,
		title: "Taxes. Discuss.",
		date: "11/06/2022, 07:30",
		num_posts: 4,
		category: "General",
		group_id: null
	}, {
		thread_id: 7,
		author_id: 105,
		title: "Weather Discussion",
		date: "11/06/2022, 11:10",
		num_posts: 6,
		category: "General",
		group_id: null
	}, {
		thread_id: 8,
		author_id: 103,
		title: "Looking for someone to watch movies with tomorrow.",
		date: "11/06/2022, 11:45",
		num_posts: 8,
		category: "Social",
		group_id: null
	}, {
		thread_id: 9,
		author_id: 103,
		title: "Where can I find good printers to buy in person?",
		date: "11/06/2022, 12:15",
		num_posts: 2,
		category: "Questions",
		group_id: null
	}, {
		thread_id: 10,
		author_id: 107,
		title: "Gatormmunity love!",
		date: "11/09/2022, 14:00",
		num_posts: 2,
		category: "General",
		group_id: 1
	}
]

/** Mock posts for the forums. */
export const mockPosts = [
	{
		post_id: 0,
		body:
			`I really like the English opening. Does anyone else play the English?
			It is very underrated imo.`,
		date: "11/01/2022, 16:20",
		author_id: 100,
		thread_id: 0,
		thumbnail_path: '/images/m3_data/chess.jpg',
		image_path: '/images/m3_data/chess.jpg',
		filename: 'chess.jpg'
	}, {
		post_id: 1,
		body:
			`Please come! Everyone is welcome, and we have enough pizza for days!`,
		date: "11/02/2022, 10:00",
		author_id: 102,
		thread_id: 1,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 2,
		body:
			`1. d4 is the best by test.
			1. e4 is garbage.
			Discuss.`,
		date: "11/02/2022, 11:10",
		author_id: 101,
		thread_id: 2,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 3,
		body:
			`I am kipperkipkip on chess.com. 1100 blitz. DM or send a friend request on chess.com\
			if you're down for some games.`,
		date: "11/04/2022, 01:00",
		author_id: 101,
		thread_id: 3,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 4,
		body:
			`What is the derivative of 8x^2? Please someone help!`,
		date: "11/05/2022, 23:10",
		author_id: 102,
		thread_id: 4,
		thumbnail_path: '/images/m3_data/euler.png',
		image_path: '/images/m3_data/euler.png',
		filename: 'god.png'
	}, {
		post_id: 5,
		body:
			`What days do the Scorpio sign correspond to? Thanks!`,
		date: "11/05/2022, 23:25",
		author_id: 101,
		thread_id: 5,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 6,
		body:
			`I love taxes!`,
		date: "11/06/2022, 07:30",
		author_id: 100,
		thread_id: 6,
		thumbnail_path: '/images/m3_data/usaFlag.jpg',
		image_path: '/images/m3_data/usaFlag.jpg',
		filename: 'I_love_USA.jpg'
	}, {
		post_id: 7,
		body:
			`Me too! Let's all do our share to keep this country going strong.`,
		date: "11/06/2022, 08:00",
		author_id: 101,
		thread_id: 6,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 8,
		body:
			`Yo I am down. Friend request sent!`,
		date: "11/06/2022, 10:00",
		author_id: 102,
		thread_id: 3,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 9,
		body:
			`The deadline for the assignment has passed. Thanks for nothing, everyone.`,
		date: "11/06/2022, 11:00",
		author_id: 102,
		thread_id: 4,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 10,
		body:
			`I got the friend request and accepted it. Thanks, I hope to play you someday!`,
		date: "11/06/2022, 11:30",
		author_id: 101,
		thread_id: 3,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 11,
		body:
			`I love seeing it rain in San Francisco. We really do need some more.
			
			Does anyone else agree?`,
		date: "11/06/2022, 11:10",
		author_id: 105,
		thread_id: 7,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 12,
		body:
			`I am going to Stonestown to watch movies. Does anyone want to come along?`,
		date: "11/06/2022, 11:45",
		author_id: 103,
		thread_id: 8,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 13,
		body:
			`My printer broke, and I need it within a few days to print my essay... T_T`,
		date: "11/06/2022, 12:15",
		author_id: 103,
		thread_id: 9,
		thumbnail_path: '/images/m3_data/pain.jpg',
		image_path: '/images/m3_data/pain.jpg',
		filename: 'pain.jpg'
	}, {
		post_id: 14,
		body:
			`yo im down. what are we gonna watch?`,
		date: "11/06/2022, 12:20",
		author_id: 107,
		thread_id: 8,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 15,
		body:
			`bro?`,
		date: "11/06/2022, 22:00",
		author_id: 107,
		thread_id: 8,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 16,
		body:
			`I can watch movies with you, Hatsune.`,
		date: "11/07/2022, 05:54",
		author_id: 100,
		thread_id: 8,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 17,
		body:
			`ok`,
		date: "11/07/2022, 06:18",
		author_id: 107,
		thread_id: 8,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}, {
		post_id: 18,
		body:
			`Gatormmunity love!`,
		date: "11/09/2022, 14:00",
		author_id: 107,
		thread_id: 10,
		thumbnail_path: "/images/m3_data/hearts.png",
		image_path: "/images/m3_data/hearts.png",
		filename: "Gatormmunity Love.png"
	}, {
		post_id: 19,
		body:
			`Yes, I agree completely.`,
		date: "11/09/2022, 14:45",
		author_id: 103,
		thread_id: 10,
		thumbnail_path: null,
		image_path: null,
		filename: null
	}
];