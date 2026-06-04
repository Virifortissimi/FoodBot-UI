type RuntimeConfig = {
    apiUrl?: string;
    supabaseUrl?: string;
    supabaseKey?: string;
    aiCoach?: {
        enabled?: boolean;
        whatsappUrl?: string;
    };
};

const runtimeConfig = (globalThis as typeof globalThis & { __FOODBOT_CONFIG__?: RuntimeConfig }).__FOODBOT_CONFIG__ || {};

export const environment = {
    production: false,
    supabaseUrl: runtimeConfig.supabaseUrl || 'https://[project].supabase.co',
    supabaseKey: runtimeConfig.supabaseKey || '[anon-key]',
    apiUrl: runtimeConfig.apiUrl || 'https://localhost:7149/api/v1',
    aiCoach: {
        enabled: runtimeConfig.aiCoach?.enabled ?? true,
        whatsappUrl: runtimeConfig.aiCoach?.whatsappUrl || 'https://wa.me/2340000000000?text=Hello%20FoodBot%2C%20I%20need%20help%20with%20my%20meal%20plan.'
    }
};
