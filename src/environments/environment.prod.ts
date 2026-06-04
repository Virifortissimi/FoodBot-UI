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
const processEnv = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env || {};

export const environment = {
    production: true,
    supabaseUrl: runtimeConfig.supabaseUrl || processEnv['FOODBOT_SUPABASE_URL'] || 'https://[project].supabase.co',
    supabaseKey: runtimeConfig.supabaseKey || processEnv['FOODBOT_SUPABASE_KEY'] || '[anon-key]',
    apiUrl: runtimeConfig.apiUrl || processEnv['FOODBOT_API_URL'] || processEnv['API_URL'] || 'https://foodbot-api-latest.onrender.com/api/v1',
    aiCoach: {
        enabled: runtimeConfig.aiCoach?.enabled ?? parseRuntimeBoolean(processEnv['FOODBOT_AI_COACH_ENABLED']) ?? true,
        whatsappUrl: runtimeConfig.aiCoach?.whatsappUrl || processEnv['FOODBOT_AI_COACH_WHATSAPP_URL'] || 'https://wa.me/2340000000000?text=Hello%20FoodBot%2C%20I%20need%20help%20with%20my%20meal%20plan.'
    }
};

function parseRuntimeBoolean(value: string | undefined): boolean | undefined {
    if (value == null || value === '') {
        return undefined;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
