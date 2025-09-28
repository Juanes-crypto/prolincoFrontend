// frontend/src/pages/UserManagement.jsx (COMPLETO Y CORREGIDO)

import React, { useState, useEffect, useContext } from "react"; // 🌟 Importar useContext 🌟
import Card from "../components/Card";
import {
  UsersIcon,
  UserCircleIcon,
  Cog6ToothIcon, // Ajustado de AdjustmentsHorizontalIcon a Cog6ToothIcon (Ajustes)
  PencilIcon,
  ArrowDownTrayIcon, // Ajustado de SaveIcon/FloppyDiskIcon a ArrowDownTrayIcon (Guardar)
  XMarkIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { API } from "../api/api";
// 🌟 Importar el contexto de autenticación 🌟
import { AuthContext } from "../context/AuthContextDefinition";

const UserManagement = () => {
  const { user, logout } = useContext(AuthContext); // 👈 ¡Obtenemos el usuario logueado y la función logout!

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  // 🌟 LA FUENTE DE VERDAD DEBE SER EL CONTEXTO 🌟
  const isAdmin = user?.role === "admin";

  // Roles permitidos por la aplicación
  const availableRoles = [
    { value: "admin", label: "Administrador (Total)" },
    { value: "talento", label: "Talento Humano" },
    { value: "servicio", label: "Servicio al Cliente" },
    { value: "basico", label: "Básico (Módulos Asignados)" }, // Agregué 'basico' para mayor claridad
    { value: "invitado", label: "Invitado (Solo Ver)" },
  ];

  // 1. Carga de Usuarios
  const fetchUsers = async () => {
    if (!isAdmin) {
      // Si no es admin, no se hace la llamada, pero el return final maneja la UI
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Usa la API que incluye el token en el header (asumiendo que API está configurada)
      const response = await API.get("/users");
      setUsers(response.data);
      setError(null);
    } catch (_err) {
      // Este error puede ser un 403 del backend, que es el error que buscamos
      if (_err.response?.status === 403) {
        setError(
          "Error de Backend: Permisos insuficientes para acceder a esta lista."
        );
      } else {
        setError(
          _err.response?.data?.message ||
            "Error al cargar la lista de usuarios. Verifica la ruta del backend '/users'."
        );
      }
      console.error("Error al cargar usuarios:", _err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ejecutar fetchUsers cuando el estado del usuario/rol en el contexto cambie
    fetchUsers();
  }, [user]); // 🌟 Dependencia en 'user' del contexto 🌟

  // 2. Iniciar Edición de Rol (Mismo código, correcto)
  const startEdit = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  // 3. Guardar el Nuevo Rol (Modificado)
  const handleRoleUpdate = async (e) => {
    e.preventDefault();

    if (!editingUser || !newRole) return;

    setLoading(true);
    try {
      // Endpoint para actualizar un usuario por su ID
      const response = await API.put(`/users/${editingUser._id}`, { role: newRole });

      // ** 🚨 NUEVA LÓGICA DE SEGURIDAD 🚨 **
      const updatedUserId = response.data.user._id;

      // Si el usuario que acabamos de modificar es el mismo usuario logueado (el Admin)
      if (user?._id === updatedUserId) {
        alert("¡Tu rol ha sido actualizado! Debes iniciar sesión de nuevo.");
        logout();
        return; // Detener la ejecución
      }

      // Actualizar el estado local (para que el Admin vea el cambio)
      setUsers(users.map(u =>
        u._id === updatedUserId ? { ...u, role: newRole } : u
      ));

      setEditingUser(null);
      setNewRole('');
      alert(`Rol de ${editingUser.name} actualizado con éxito.`);

    } catch (_err) {
      setError(
        _err.response?.data?.message ||
        "Error al actualizar el rol del usuario."
      );
      console.error("Error al actualizar rol:", _err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Componente Modal de Edición de Rol (Mismo código, corregí el icono)
  const EditRoleModal = () => {
    if (!editingUser) return null;

    return (
      <div className="fixed inset-0 bg-prolinco-dark bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
        <Card
          title={`Editar Rol de: ${editingUser.name}`}
          color="bg-white"
          icon={Cog6ToothIcon} // 🌟 Usando el icono Cog6ToothIcon 🌟
          className="w-full max-w-lg"
          hoverEffect={false}
        >
          <form onSubmit={handleRoleUpdate}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Nuevo Rol
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-prolinco-primary focus:border-prolinco-primary"
              required
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-prolinco-dark hover:bg-gray-100 transition duration-150"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 bg-prolinco-primary text-prolinco-dark font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-300 transition duration-150"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                {loading ? "Guardando..." : "Guardar Rol"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  // 🌟 2. EL RETURN CONDICIONAL SE MANTIENE AQUÍ 🌟
  if (!isAdmin)
    return (
      <div className="text-red-600 text-center p-10 font-black flex flex-col items-center">
        <LockClosedIcon className="h-10 w-10 mb-4" />
        ACCESO DENEGADO: Esta sección es solo para **Administradores**.
      </div>
    );
  if (loading)
    return (
      <div className="text-prolinco-secondary text-center p-10 font-semibold">
        Cargando lista de usuarios...
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center p-10 font-semibold">{error}</div>
    );

  // ... Resto del JSX (correctamente renderizado solo para admins)
  return (
    <div className="animate-fadeIn relative">
      {/* ... (Todo el contenido de la tabla es correcto) */}
      <EditRoleModal />

      <header className="mb-8 border-b border-prolinco-primary pb-4">
        <h1 className="text-4xl font-black text-prolinco-secondary flex items-center">
          <UsersIcon className="h-8 w-8 mr-3 text-prolinco-primary" />
          Gestión de Usuarios y Roles
        </h1>
        <p className="text-gray-500 mt-1">
          Administración de permisos de acceso a las diferentes plataformas
          internas.
        </p>
      </header>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-prolinco-light">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rol Actual
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-prolinco-dark flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-prolinco-secondary" />
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "talento"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "servicio"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {availableRoles.find((r) => r.value === user.role)?.label ||
                      user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => startEdit(user)}
                    className="text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center justify-end"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Cambiar Rol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center p-10 text-gray-500">
          No se encontraron usuarios registrados en la base de datos.
        </div>
      )}
    </div>
  );
};

export default UserManagement;
