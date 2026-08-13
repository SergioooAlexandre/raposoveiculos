import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './hooks/useToast';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Loader2 } from 'lucide-react';

// Lazy Loaded Public Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Stock = lazy(() => import('./pages/Stock').then(m => ({ default: m.Stock })));
const Offers = lazy(() => import('./pages/Offers').then(m => ({ default: m.Offers })));
const Favorites = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail').then(m => ({ default: m.VehicleDetail })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));

// Lazy Loaded Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminVehicles = lazy(() => import('./pages/admin/AdminVehicles').then(m => ({ default: m.AdminVehicles })));
const AdminVehicleForm = lazy(() => import('./pages/admin/AdminVehicleForm').then(m => ({ default: m.AdminVehicleForm })));
const AdminProposals = lazy(() => import('./pages/admin/AdminProposals').then(m => ({ default: m.AdminProposals })));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts').then(m => ({ default: m.AdminContacts })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
    <Loader2 className="w-8 h-8 text-[#E11D48] animate-spin" />
    <span className="text-xs font-mono text-gray-400 mt-3 tracking-widest uppercase">
      Carregando...
    </span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              
              {/* Public Storefront Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/estoque" element={<Stock />} />
                <Route path="/ofertas" element={<Offers />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/veiculo/:slug" element={<VehicleDetail />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />
              </Route>

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="veiculos" element={<AdminVehicles />} />
                <Route path="veiculos/novo" element={<AdminVehicleForm />} />
                <Route path="veiculos/:id/editar" element={<AdminVehicleForm />} />
                <Route path="propostas" element={<AdminProposals />} />
                <Route path="contatos" element={<AdminContacts />} />
                <Route path="configuracoes" element={<AdminSettings />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
