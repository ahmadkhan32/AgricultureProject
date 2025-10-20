# Development Setup Guide

## Authentication Setup

The UCAEP website supports both development mode (with mock authentication) and production mode (with real Supabase authentication).

### Development Mode (Current)

The application is currently running in **development mode** with mock authentication. This allows you to test all features without setting up a real Supabase instance.

#### Pre-configured Test Accounts

**Admin Account:**
- Email: `admin@ucaeep.km`
- Password: `admin123`
- Role: Admin

**Producer Account:**
- Email: `producer@example.com`
- Password: `producer123`
- Role: Producer

#### Features Available in Development Mode

✅ **Admin Registration** - Create new admin accounts
✅ **User Registration** - Create new producer accounts
✅ **Login/Logout** - Full authentication flow
✅ **Role-based Access** - Admin and producer permissions
✅ **Profile Management** - Update user profiles
✅ **Password Reset** - Mock password reset functionality
✅ **Session Persistence** - Login state maintained across page refreshes

### Production Mode (Supabase)

To use real Supabase authentication in production:

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Set Environment Variables:**
   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_DEV_MODE=false
   ```

3. **Set up Database Tables:**
   Run the SQL scripts in `server/database/` to create the required tables.

### Switching Between Modes

The application automatically detects the environment:
- **Development Mode**: When `REACT_APP_DEV_MODE=true` or using demo credentials
- **Production Mode**: When real Supabase credentials are provided

### Testing Authentication

1. **Test Admin Login:**
   - Go to `/login`
   - Use: `admin@ucaeep.km` / `admin123`
   - Should redirect to admin dashboard

2. **Test Producer Login:**
   - Go to `/login`
   - Use: `producer@example.com` / `producer123`
   - Should redirect to producer dashboard

3. **Test Registration:**
   - Go to `/register` for producer registration
   - Go to `/admin/register` for admin registration
   - Create new accounts and test login

### Troubleshooting

**"Failed to fetch" Error:**
- This is normal in development mode
- The mock authentication handles all requests locally
- Check browser console for any JavaScript errors

**Login Not Working:**
- Ensure you're using the correct test credentials
- Check browser console for error messages
- Try clearing browser cache/localStorage

**Admin Access Issues:**
- Make sure you're logged in with an admin account
- Check that the user role is set to 'admin'
- Verify the admin route protection is working

### Development Features

- **Mock Data**: All sample data (news, producers, partnerships, resources) is automatically populated
- **Local Storage**: User sessions are stored in browser localStorage
- **Error Handling**: Comprehensive error messages and toast notifications
- **Role Management**: Full admin and producer role separation

### Next Steps

1. Test all authentication flows
2. Verify admin and producer dashboards work correctly
3. Test CRUD operations in admin panel
4. When ready for production, set up real Supabase instance
