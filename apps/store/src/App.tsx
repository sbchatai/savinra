import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from '@/context/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import PrototypeBanner from '@/components/layout/PrototypeBanner'
import ScrollToTop from '@/components/layout/ScrollToTop'
import ChatWidget from '@/components/layout/ChatWidget'
import SavinraHeader from '@/components/layout/SavinraHeader'
import SavinraFooter from '@/components/layout/SavinraFooter'
import HomePage from '@/pages/HomePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderConfirmationPage from '@/pages/OrderConfirmationPage'
import ShopPage from '@/pages/ShopPage'
import CollectionsPage from '@/pages/CollectionsPage'
import CollectionDetailPage from '@/pages/CollectionDetailPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import ReturnsPage from '@/pages/ReturnsPage'
import WishlistPage from '@/pages/WishlistPage'
import AccountPage from '@/pages/AccountPage'
import HelpPage from '@/pages/HelpPage'
import ShopCategoryPage from '@/pages/ShopCategoryPage'
import AboutPage from '@/pages/AboutPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SavinraHeader />
      <main className="min-h-screen">{children}</main>
      <SavinraFooter />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <PrototypeBanner />
            <AuthModal />
            <ChatWidget />
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/products/:slug" element={<Layout><ProductDetailPage /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
              <Route path="/shop/:categorySlug" element={<Layout><ShopCategoryPage /></Layout>} />
              <Route path="/shop/:categorySlug/:subcategorySlug" element={<Layout><ShopCategoryPage /></Layout>} />
              <Route path="/collections" element={<Layout><CollectionsPage /></Layout>} />
              <Route path="/collections/:slug" element={<Layout><CollectionDetailPage /></Layout>} />
              <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
              <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />
              <Route path="/returns" element={<Layout><ReturnsPage /></Layout>} />
              <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
              <Route path="/account" element={<Layout><AccountPage /></Layout>} />
              <Route path="/help" element={<Layout><HelpPage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
