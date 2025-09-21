import { User } from '../models/user.model.js';

export const createBotUser = async () => {
    try {
        // Check if bot user already exists
        let botUser = await User.findOne({ email: 'bot@roselmeat.com' });
        
        if (!botUser) {
            // Create bot user
            botUser = new User({
                name: 'FAQ Assistant',
                email: 'bot@roselmeat.com',
                password: 'bot_password_123', // This won't be used for login
                role: 'bot', // We'll need to update the user model to support this
                isVerified: true
            });
            
            await botUser.save();
            console.log('Bot user created successfully');
        }
        
        return botUser;
    } catch (error) {
        console.error('Error creating bot user:', error);
        return null;
    }
};
