// src/utils/databaseService.js
import { supabase } from './supabaseClient.js';

// =============================================
// FUNCIONES DE AUTENTICACIÓN
// =============================================

export const loginUser = async (dni, password) => {
  try {
    // Buscar primero en administradores
    const { data: admin, error: adminError } = await supabase
      .from('administradores')
      .select('*')
      .eq('dni', dni)
      .eq('password', password)
      .single();

    if (admin && !adminError) {
      if (!admin.is_active) {
        return { success: false, error: 'Usuario desactivado. Contacte al administrador.' };
      }

      return {
        success: true,
        user: {
          ...admin,
          tipo: 'admin',
          rol: admin.cargo.toUpperCase() === "ADMIN" ? "administrador" : admin.cargo.toLowerCase().replace(" ", ""),
          permisos: getPermissionsByRole(admin.cargo)
        }
      };
    }

    // Si no es admin, buscar en asesores
    const { data: asesor, error: asesorError } = await supabase
      .from('asesores')
      .select('*')
      .eq('dni', dni)
      .eq('password', password)
      .single();

    if (asesor && !asesorError) {
      if (!asesor.is_active) {
        return { success: false, error: 'Usuario desactivado. Contacte al administrador.' };
      }
      
      return {
        success: true,
        user: {
          ...asesor,
          tipo: 'asesor',
          rol: 'asesor',
          permisos: ['tab1', 'tab4']
        }
      };
    }

    return { success: false, error: 'Usuario o contraseña incorrectos' };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
};

const getPermissionsByRole = (cargo) => {
  switch (cargo.toUpperCase()) {
    case 'ADMIN':
      return ['tab1', 'tab2', 'tab3', 'tab4'];
    case 'BACK OFFICE':
      return ['tab1', 'tab3', 'tab4'];
    case 'SUPERVISOR':
      return ['tab1', 'tab3', 'tab4'];
    default:
      return ['tab1'];
  }
};

// =============================================
// FUNCIONES DE ADMINISTRADORES
// =============================================

export const getAdministradores = async () => {
  try {
    const { data, error } = await supabase
      .from('administradores')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createAdministrador = async (adminData) => {
  try {
    const { data, error } = await supabase
      .from('administradores')
      .insert([{
        id: adminData.id,
        dni: adminData.dni,
        nombre: adminData.nombre.toUpperCase(),
        password: adminData.contraseña,
        cargo: adminData.cargo.toUpperCase(),
        is_active: true,
        show_password: false
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateAdministrador = async (id, updateData) => {
  try {
    const updateObj = {
      nombre: updateData.nombre?.toUpperCase(),
      cargo: updateData.cargo?.toUpperCase(),
      ...(updateData.contraseña && { password: updateData.contraseña })
    };

    const { data, error } = await supabase
      .from('administradores')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteAdministrador = async (id) => {
  try {
    const { error } = await supabase
      .from('administradores')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const toggleAdministradorActive = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('administradores')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =============================================
// FUNCIONES DE ASESORES
// =============================================

export const getAsesores = async () => {
  try {
    const { data, error } = await supabase
      .from('asesores')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createAsesor = async (asesorData) => {
  try {
    const { data, error } = await supabase
      .from('asesores')
      .insert([{
        id: asesorData.id,
        dni: asesorData.dni,
        nombre: asesorData.nombre.toUpperCase(),
        password: asesorData.contraseña,
        turno: asesorData.turno.toUpperCase(),
        is_active: true,
        show_password: false
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateAsesor = async (id, updateData) => {
  try {
    const updateObj = {
      nombre: updateData.nombre?.toUpperCase(),
      turno: updateData.turno?.toUpperCase(),
      ...(updateData.password && { password: updateData.password })
    };

    const { data, error } = await supabase
      .from('asesores')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteAsesor = async (id) => {
  try {
    const { error } = await supabase
      .from('asesores')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const toggleAsesorActive = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('asesores')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =============================================
// FUNCIONES DE BASES (ACTUALIZADAS)
// =============================================

export const getBases = async (userId = null, userType = null) => {
  try {
    let query = supabase
      .from('bases')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (userType) {
      query = query.eq('user_type', userType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createBase = async (baseData) => {
  try {
    // Crear la base
    const { data: base, error: baseError } = await supabase
      .from('bases')
      .insert([{
        nombre: baseData.nombre,
        fecha: baseData.fecha,
        user_id: baseData.userId,
        user_type: baseData.userType
      }])
      .select()
      .single();

    if (baseError) throw baseError;

    // Si hay datos, insertarlos
    if (baseData.datos && baseData.datos.length > 0) {
      const baseDataRecords = baseData.datos.map(item => ({
        base_id: base.id,
        dni: item.dni || '',
        nombre_completo: item.nombreCompleto || '',
        numero1: item.numero1 || '',
        numero2: item.numero2 || '',
        tipificacion: item.tipificacion || ''
      }));

      const { error: dataError } = await supabase
        .from('base_data')
        .insert(baseDataRecords);

      if (dataError) throw dataError;
    }

    return { success: true, data: base };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteBase = async (baseId) => {
  try {
    // Primero eliminar todos los datos de la base (CASCADE debería manejar esto)
    const { error } = await supabase
      .from('bases')
      .delete()
      .eq('id', baseId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =============================================
// FUNCIONES DE DATOS DE BASE
// =============================================

export const getBaseData = async (baseId) => {
  try {
    const { data, error } = await supabase
      .from('base_data')
      .select('*')
      .eq('base_id', baseId)
      .order('id', { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createBaseDataRecord = async (baseId, recordData) => {
  try {
    const { data, error } = await supabase
      .from('base_data')
      .insert([{
        base_id: baseId,
        dni: recordData.dni || '',
        nombre_completo: recordData.nombreCompleto || '',
        numero1: recordData.numero1 || '',
        numero2: recordData.numero2 || '',
        tipificacion: recordData.tipificacion || ''
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateBaseDataRecord = async (recordId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('base_data')
      .update({
        dni: updateData.dni || '',
        nombre_completo: updateData.nombreCompleto || '',
        numero1: updateData.numero1 || '',
        numero2: updateData.numero2 || '',
        tipificacion: updateData.tipificacion || ''
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteBaseDataRecord = async (recordId) => {
  try {
    const { error } = await supabase
      .from('base_data')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateTipificacion = async (recordId, tipificacion) => {
  try {
    const { data, error } = await supabase
      .from('base_data')
      .update({ tipificacion })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =============================================
// FUNCIONES UTILITARIAS
// =============================================

export const getNextAdminId = async () => {
  try {
    const { data, error } = await supabase
      .from('administradores')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const lastId = parseInt(data[0].id.split('-')[1]);
      return `admin-${lastId + 1}`;
    }

    return 'admin-1';
  } catch (error) {
    return 'admin-1';
  }
};

export const getNextAsesorId = async () => {
  try {
    const { data, error } = await supabase
      .from('asesores')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const lastId = parseInt(data[0].id.split('-')[1]);
      return `asesor-${lastId + 1}`;
    }

    return 'asesor-1';
  } catch (error) {
    return 'asesor-1';
  }
};

// =============================================
// FUNCIONES ADICIONALES DE BASES (ACTUALIZADAS)
// =============================================

export const getBasesWithData = async (userId = null, userType = null) => {
  try {
    let query = supabase
      .from('bases')
      .select(`
        *,
        base_data (*)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (userType) {
      query = query.eq('user_type', userType);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Formatear datos al formato esperado por la aplicación
    const formattedBases = data.map(base => ({
      id: base.id,
      nombre: base.nombre,
      fecha: base.fecha,
      advisorId: base.user_id, // Mantenemos advisorId para compatibilidad con el frontend
      userId: base.user_id,
      userType: base.user_type,
      datos: base.base_data.map(item => ({
        id: item.id,
        dni: item.dni || '',
        nombreCompleto: item.nombre_completo || '',
        numero1: item.numero1 || '',
        numero2: item.numero2 || '',
        tipificacion: item.tipificacion || ''
      }))
    }));

    return { success: true, data: formattedBases };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createBaseWithData = async (baseData, userId, userType) => {
  try {
    // Formatear fecha
    let fechaFormateada;
    if (baseData.dia) {
      const [year, month, day] = baseData.dia.split('-');
      const fechaLocal = new Date(year, month - 1, day);
      fechaFormateada = fechaLocal.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
    } else {
      fechaFormateada = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }

    // Crear la base
    const { data: base, error: baseError } = await supabase
      .from('bases')
      .insert([{
        nombre: baseData.nombre || `Base ${Date.now()}`,
        fecha: fechaFormateada,
        user_id: userId,
        user_type: userType
      }])
      .select()
      .single();

    if (baseError) throw baseError;

    // Si hay datos, insertarlos
    if (baseData.datos && baseData.datos.length > 0) {
      const baseDataRecords = baseData.datos.map(item => ({
        base_id: base.id,
        dni: item.dni || '',
        nombre_completo: item.nombreCompleto || '',
        numero1: item.numero1 || '',
        numero2: item.numero2 || '',
        tipificacion: item.tipificacion || ''
      }));

      const { error: dataError } = await supabase
        .from('base_data')
        .insert(baseDataRecords);

      if (dataError) throw dataError;
    }

    // Retornar la base con formato de la aplicación
    const formattedBase = {
      id: base.id,
      nombre: base.nombre,
      fecha: base.fecha,
      advisorId: base.user_id, // Para compatibilidad
      userId: base.user_id,
      userType: base.user_type,
      datos: baseData.datos || []
    };

    return { success: true, data: formattedBase };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateBaseData = async (baseId, newData) => {
  try {
    // Primero eliminar todos los datos existentes de la base
    await supabase
      .from('base_data')
      .delete()
      .eq('base_id', baseId);

    // Insertar los nuevos datos
    if (newData && newData.length > 0) {
      const baseDataRecords = newData.map(item => ({
        base_id: baseId,
        dni: item.dni || '',
        nombre_completo: item.nombreCompleto || '',
        numero1: item.numero1 || '',
        numero2: item.numero2 || '',
        tipificacion: item.tipificacion || ''
      }));

      const { error: insertError } = await supabase
        .from('base_data')
        .insert(baseDataRecords);

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addDataToBase = async (baseId, recordData) => {
  try {
    const { data, error } = await supabase
      .from('base_data')
      .insert([{
        base_id: baseId,
        dni: recordData.dni || '',
        nombre_completo: recordData.nombreCompleto || '',
        numero1: recordData.numero1 || '',
        numero2: recordData.numero2 || '',
        tipificacion: recordData.tipificacion || ''
      }])
      .select()
      .single();

    if (error) throw error;

    // Retornar en formato de la aplicación
    const formattedData = {
      id: data.id,
      dni: data.dni || '',
      nombreCompleto: data.nombre_completo || '',
      numero1: data.numero1 || '',
      numero2: data.numero2 || '',
      tipificacion: data.tipificacion || ''
    };

    return { success: true, data: formattedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSingleRecord = async (recordId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('base_data')
      .update({
        dni: updateData.dni || '',
        nombre_completo: updateData.nombreCompleto || '',
        numero1: updateData.numero1 || '',
        numero2: updateData.numero2 || '',
        tipificacion: updateData.tipificacion || ''
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;

    // Retornar en formato de la aplicación
    const formattedData = {
      id: data.id,
      dni: data.dni || '',
      nombreCompleto: data.nombre_completo || '',
      numero1: data.numero1 || '',
      numero2: data.numero2 || '',
      tipificacion: data.tipificacion || ''
    };

    return { success: true, data: formattedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteSingleRecord = async (recordId) => {
  try {
    const { error } = await supabase
      .from('base_data')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =============================================
// FUNCIÓN AUXILIAR PARA DETERMINAR USER_TYPE
// =============================================

export const getUserTypeFromRole = (userRole, userCargo) => {
  if (userRole === 'asesor') {
    return 'ASESOR';
  }
  
  // Para administradores, usar su cargo específico
  switch (userCargo?.toUpperCase()) {
    case 'ADMIN':
      return 'ADMIN';
    case 'BACK OFFICE':
      return 'BACK OFFICE';
    case 'SUPERVISOR':
      return 'SUPERVISOR';
    default:
      return 'ADMIN'; // Por defecto
  }
};