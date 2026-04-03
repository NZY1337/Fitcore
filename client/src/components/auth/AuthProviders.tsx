import googleLogo from '../../assets/google.svg';
import facebookLogo from '../../assets/facebook.svg';
import { useAppContext } from '../../context/AppContext';

type AuthProvidersProps = 'google' | 'facebook';

function AuthProviders({ provider }: { provider: AuthProvidersProps }) {
    const { login } = useAppContext();

    const handleLogin = () => {
        switch (provider) {
            case 'google':
                return <>
                    <button onClick={() => login('google')} className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-5 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                        <img src={googleLogo} alt="" />
                        Sign up with Google
                    </button>
                </>
            case 'facebook':
                return <>
                    <button onClick={() => login('facebook')} className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-5 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                        <img src={facebookLogo} alt="" />
                        Sign up with Facebook
                    </button>
                </>
            default:
                return <p className='text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-md'>Invalid provider type</p>
        }
    }

    return (
        <>
            {handleLogin()}
        </>
    )
}

export default AuthProviders
