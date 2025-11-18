-- ===== SETUP.sql =====
-- Ejecutar este SQL en Supabase SQL Editor para configurar la base de datos
-- No requiere dependencias, solo SQL puro

-- ===== TABLA DE USUARIOS EXTENDIDA =====
-- Almacena información adicional del usuario
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA DE ACTIVIDAD =====
-- Auditoría de acciones del usuario
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== HABILITAR ROW LEVEL SECURITY =====
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS DE SEGURIDAD =====
-- Cada usuario solo puede ver su propio perfil
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Cada usuario solo puede ver sus logs
CREATE POLICY "Users can view their own logs"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id);

-- ===== FUNCIÓN AUTOMÁTICA: Crear usuario en tabla 'users' =====
-- Se ejecuta cuando se registra un nuevo usuario en auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Ejecutar función al crear usuario en auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ===== FUNCIÓN AUTOMÁTICA: Actualizar timestamp =====
-- Actualiza 'updated_at' automáticamente en cada cambio
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Actualizar 'updated_at' en tabla users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON public.activity_logs(timestamp);

-- ===== COMENTARIOS =====
COMMENT ON TABLE public.users IS 'Información extendida de usuarios';
COMMENT ON TABLE public.activity_logs IS 'Auditoría de acciones de usuarios';
