import { Link, useNavigate } from 'react-router-dom';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { Trans } from '@/components/Trans';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { parseAsName, parseAsEmail, parseAsEncryptedPassword, parseAsLoading } from '@/lib/parsers';

export default function SignupPage() {
  const [name, setName] = useQueryState('name', parseAsName);
  const [email, setEmail] = useQueryState('email', parseAsEmail);
  const [password, setPassword] = useQueryState('password', parseAsEncryptedPassword.withDefault(''));
  const [confirmPassword, setConfirmPassword] = useQueryState('confirmPassword', parseAsEncryptedPassword.withDefault(''));
  const [isLoading, setIsLoading] = useQueryState('loading', parseAsLoading);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Get translated placeholders
  const { t: fullNamePlaceholder } = useTranslation({ 
    key: 'signup.fullNamePlaceholder', 
    text: 'Full Name' 
  });
  const { t: emailPlaceholder } = useTranslation({ 
    key: 'signup.emailPlaceholder', 
    text: 'Email address' 
  });
  const { t: passwordPlaceholder } = useTranslation({ 
    key: 'signup.passwordPlaceholder', 
    text: 'Password' 
  });
  const { t: confirmPasswordPlaceholder } = useTranslation({ 
    key: 'signup.confirmPasswordPlaceholder', 
    text: 'Confirm Password' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((password || '') !== (confirmPassword || '')) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      await signup({
        name: name || '',
        email: email || '',
        password: password || ''
      });
      // Clear query params after successful signup
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            <Trans translationKey="signup.title" text="Create your account" />
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Trans translationKey="signup.or" text="Or" />{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              <Trans translationKey="signup.signInExisting" text="sign in to your existing account" />
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                <Trans translationKey="signup.fullName" text="Full Name" />
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={fullNamePlaceholder}
                value={name || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                <Trans translationKey="signup.emailAddress" text="Email Address" />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={emailPlaceholder}
                value={email || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                <Trans translationKey="signup.password" text="Password" />
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={passwordPlaceholder}
                value={password || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                <Trans translationKey="signup.confirmPassword" text="Confirm Password" />
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={confirmPasswordPlaceholder}
                value={confirmPassword || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <Trans translationKey="signup.creatingAccount" text="Creating account..." />
              ) : (
                <Trans translationKey="signup.signUp" text="Sign up" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
