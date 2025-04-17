
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AudioProvider>
      <div className="flex h-screen items-center justify-center bg-gradient-radial from-emerald-50 via-white to-white">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-emerald-700">404</h1>
          <h2 className="mt-2 text-2xl font-medium text-emerald-600">{t('page_not_found')}</h2>
          <p className="mt-4 text-gray-600">{t('page_not_found_desc')}</p>
          <Button 
            className="mt-6 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate('/')}
          >
            {t('back_to_home')}
          </Button>
        </div>
      </div>
    </AudioProvider>
  );
}
