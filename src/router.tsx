import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import HomeView from "./views/HomeView";
import TopicView from "./views/TopicView";
import ProfileView from "./views/ProfileView";
import CreateTopicView from "./views/CreateTopicView";
import { ToastContainer } from "react-toastify";
import RegisterView from "./views/auth/RegisterView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import RequestCodeView from "./views/auth/RequestCodeView";
import ResetPassword from "./views/auth/ResetPassword";
import ConfirmAccount from "./views/auth/ConfirmAccountView";
import NotFoundPage from "./views/NotFoundPage";
import NotificationView from "./views/NotificationView";
import OAuthCallback from "./views/auth/OAuth2Callback";

function Router() {
	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<Routes>
				{/* Rutas públicas */}
				<Route element={<PublicLayout />}>
					<Route path="/" element={<HomeView />} />
					<Route path="/login" element={<LoginView />} />
					<Route path="/oauth2/callback" element={<OAuthCallback />} />
					<Route path="/topic/:topicId" element={<TopicView />} />
					<Route path="/register" element={<RegisterView />} />
					<Route path="/forgot-password" element={<ForgotPasswordView />} />
					<Route path="/request-code" element={<RequestCodeView />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="/confirm-account/:token" element={<ConfirmAccount />} />
				</Route>

				{/* Rutas privadas */}
				<Route element={<PrivateLayout />}>
					<Route path="/topic/create" element={<CreateTopicView />} />
					<Route path="/profile" element={<ProfileView />} />
					<Route path="/notifications" element={<NotificationView />} />
				</Route>

				{/* Ruta para manejar cualquier página no encontrada */}
        		<Route path="*" element={<NotFoundPage />} /> 
			</Routes>

			{/* ToastContainer para notificaciones */}
			<ToastContainer theme="dark" />
		</BrowserRouter>
	)
}

export default Router
