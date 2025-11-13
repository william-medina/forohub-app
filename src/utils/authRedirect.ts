import { AppConfig } from "../config/env";

export function handleLoginRedirect(navigate: (path: string) => void) {
    if (AppConfig.isMicroservices) {
        const redirectUri = `${window.location.origin}/oauth2/callback`;
        const authUrl = `${AppConfig.authUrl}/oauth2/authorize?response_type=code&scope=write&response_mode=form_post&client_id=${AppConfig.clientId}&redirect_uri=${redirectUri}`;
        window.location.href = authUrl;
    } else {
        navigate("/login");
    }
}