
-- 1. Asegurar que la tabla existe con la estructura correcta
CREATE TABLE IF NOT EXISTS public.investor_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    fecha_registro DATE NOT NULL,
    codigo_registro TEXT NOT NULL UNIQUE,
    canal_ingreso TEXT,
    asesor_asignado TEXT,
    nombre_completo TEXT NOT NULL,
    tipo_documento TEXT NOT NULL,
    numero_documento TEXT NOT NULL,
    fecha_nacimiento DATE,
    nacionalidad TEXT,
    email TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    ciudad TEXT,
    pais TEXT,
    actividad_economica TEXT,
    rango_ingresos TEXT,
    origen_fondos TEXT,
    experiencia_inversiones TEXT,
    objetivo_inversion TEXT,
    horizonte_inversion TEXT,
    tolerancia_riesgo TEXT,
    firmante_nombre TEXT NOT NULL,
    firmante_fecha DATE NOT NULL
);

-- 2. Habilitar RLS (si no estaba ya habilitado)
ALTER TABLE public.investor_registrations ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas previas para evitar conflictos
DROP POLICY IF EXISTS "Permitir inserciones públicas anónimas" ON public.investor_registrations;
DROP POLICY IF EXISTS "Solo personal autorizado puede ver registros" ON public.investor_registrations;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.investor_registrations;

-- 4. Crear política de inserción TOTAL para anon (Esencial para que el formulario funcione)
CREATE POLICY "Enable insert for anonymous users" 
ON public.investor_registrations 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 5. Crear política de lectura solo para autenticados
CREATE POLICY "Enable select for authenticated users only" 
ON public.investor_registrations 
FOR SELECT 
TO authenticated 
USING (true);

-- 6. Otorgar permisos de uso al rol anon en el esquema public
GRANT INSERT ON TABLE public.investor_registrations TO anon;
GRANT USAGE ON SCHEMA public TO anon;
