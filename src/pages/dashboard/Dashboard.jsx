import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getAsesores, 
  getBasesWithData, 
  createBaseWithData, 
  deleteBase, 
  updateBaseData,
  getUserTypeFromRole
} from "../../utils/databaseService";
import Sidebar from "./Sidebar";
import HomeTab from "./HomeTab";
import UsersTab from "./UsersTab";
import AdminUsersTab from "./AdminUsersTab";
import AdvisorUsersTab from "./AdvisorUsersTab";
import BaseManagementTab from "./BaseManagementTab";
import RevisionBaseTab from "./RevisionBaseTab";
import MiBaseTab from "./MiBaseTab";
import BaseDataTab from "./BaseDataTab";
import BaseTab from "./BaseTab";
import AdvisorBaseTab from "./AdvisorBaseTab";
import "../../styles/dashboard.css";

// Importar assets
import logo from "../../assets/logo2.png";
import inicioIcon from "../../assets/inicio.png";
import usuariosIcon from "../../assets/usuarios.png";
import baseIcon from "../../assets/base.png";
import dataIcon from "../../assets/data.png";
import logoutIcon from "../../assets/logout.png";
import icono3 from "../../assets/data.png";
import userLoginIcon from "../../assets/userlogin.png";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [userSubTab, setUserSubTab] = useState("main");
  const [baseSubTab, setBaseSubTab] = useState("main");
  const [userPermissions, setUserPermissions] = useState([]);
  
  const [userRole, setUserRole] = useState("");
  const miBaseTabRef = useRef();
  const [userData, setUserData] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [advisorUsers, setAdvisorUsers] = useState([]);
  const [bases, setBases] = useState([]);
  const [basesLoading, setBasesLoading] = useState(false);
  const navigate = useNavigate();

  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  
  const handleSetActiveTab = (tabName) => {
    setSelectedBase(null);
    setSelectedAdvisor(null);
    setActiveTab(tabName);
    setBaseSubTab("main");
  };

  // NUEVA FUNCIÓN: Determinar si el usuario es privilegiado
  const isPrivilegedUser = () => {
    const cargo = userData?.cargo?.toUpperCase() || "";
    const turno = userData?.turno?.toUpperCase() || "";
    return cargo === "ADMIN" || turno === "MOVIL";
  };

  // Función para cargar asesores desde Supabase
  const loadAdvisors = async () => {
    try {
      const result = await getAsesores();
      if (result.success) {
        // Convertir formato de Supabase al formato esperado
        const formattedAsesores = result.data.map(asesor => ({
          id: asesor.id,
          dni: asesor.dni,
          nombre: asesor.nombre,
          turno: asesor.turno,
          contraseña: asesor.password,
          tipo: 'asesor',
          isActive: asesor.is_active,
          showPassword: asesor.show_password || false
        }));
        setAdvisorUsers(formattedAsesores);
      } else {
        console.error('Error cargando asesores:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para cargar bases desde Supabase
  const loadBases = async () => {
    setBasesLoading(true);
    try {
      // Cargar todas las bases sin filtrar inicialmente
      const result = await getBasesWithData();
      if (result.success) {
        setBases(result.data);
      } else {
        console.error('Error cargando bases:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBasesLoading(false);
    }
  };

  useEffect(() => {
    const permissions = JSON.parse(sessionStorage.getItem('userPermissions') || '[]');
    const role = sessionStorage.getItem('userRole') || '';
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    setUserPermissions(permissions);
    setUserRole(role);
    setUserData(user);
    
    if (!permissions.length) {
      window.location.href = "/";
    }

    // Cargar asesores y bases desde Supabase
    loadAdvisors();
    loadBases(); // Cargar todas las bases inicialmente

    const savedBaseSubTab = localStorage.getItem('baseSubTab');
    if (savedBaseSubTab) {
      setBaseSubTab(savedBaseSubTab);
    }
    const savedSelectedBaseId = localStorage.getItem('selectedBaseId');
    if (savedSelectedBaseId && bases.length > 0) {
      const savedBase = bases.find(base => base.id.toString() === savedSelectedBaseId);
      setSelectedBase(savedBase || null);
    }
  }, []);

  // recargar bases cuando el usuario cambie
  useEffect(() => {
    if (userData?.id) {
      loadBases();
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('baseSubTab', baseSubTab);
  }, [baseSubTab]);

  useEffect(() => {
    if (selectedBase) {
      localStorage.setItem('selectedBaseId', selectedBase.id);
    } else {
      localStorage.removeItem('selectedBaseId');
    }
  }, [selectedBase]);

  //Resetea selectedBase si la subpestaña no es de base de datos
  useEffect(() => {
    if (baseSubTab !== "mibase" && baseSubTab !== "mibaseData" && baseSubTab !== "baseasesor" && selectedBase) {
      setSelectedBase(null);
    }
    localStorage.setItem('baseSubTab', baseSubTab);
  }, [baseSubTab]);

  const hasPermission = (tab) => {
    const permissions = JSON.parse(sessionStorage.getItem('userPermissions') || '[]');
    return permissions.includes(tab);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  // Función actualizada para guardar base
  const handleSaveBase = async (baseData, userId) => {
    try {
      // Determinar el tipo de usuario basado en userData
      const userType = getUserTypeFromRole(userData.tipo, userData.cargo);
      
      const result = await createBaseWithData(baseData, userId, userType);
      if (result.success) {
        // Recargar bases
        await loadBases();
        setSelectedBase(result.data);
        setBaseSubTab("mibaseData");
      } else {
        alert('Error al crear la base: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleBaseClick = (base) => {
    setSelectedBase(base);
  };

  // Función actualizada para eliminar base
  const handleDeleteBase = async () => {
    if (!selectedBase) return;

    try {
      const result = await deleteBase(selectedBase.id);
      if (result.success) {
        // Recargar bases
        await loadBases();
        setBaseSubTab("mibase");
        setSelectedBase(null);
      } else {
        alert('Error al eliminar la base: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  // Función actualizada para actualizar datos de base
  const handleDataUpdate = async (newData, baseId) => {
    try {
      const result = await updateBaseData(baseId, newData);
      if (result.success) {
        // Actualizar el estado local de la base seleccionada
        if (selectedBase && selectedBase.id === baseId) {
          setSelectedBase(prev => ({
            ...prev,
            datos: newData
          }));
        }
        
        // Actualizar el estado de bases
        setBases(prevBases =>
          prevBases.map(base =>
            base.id === baseId ? { ...base, datos: newData } : base
          )
        );
      } else {
        alert('Error al actualizar los datos: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };
  
  const handleBackFromDataView = () => {
    setSelectedBase(null);
    if (selectedAdvisor) {
      setBaseSubTab("baseasesor");
    } else {
      setBaseSubTab("mibase");
    }
  };

  const CustomSidebar = () => {
    const handleLogout = () => {
      sessionStorage.clear();
      window.location.href = "/";
    };

    return (
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="sidebar-buttons">
          {hasPermission("tab1") && (
            <button onClick={() => handleSetActiveTab("tab1")}>
              <img src={inicioIcon} alt="Inicio" className="btn-icon" />
              Inicio
            </button>
          )}
          {hasPermission("tab2") && userRole === "administrador" && (
            <button onClick={() => handleSetActiveTab("tab2")}>
              <img src={usuariosIcon} alt="Usuarios" className="btn-icon" />
              Gestión de Usuarios
            </button>
          )}
          {hasPermission("tab3") && (
            <button onClick={() => handleSetActiveTab("tab3")}>
              <img src={baseIcon} alt="Base" className="btn-icon" />
              Gestión de Base
            </button>
          )}
          {hasPermission("tab4") && (
            <button onClick={() => handleSetActiveTab("tab4")}>
              <img src={dataIcon} alt="Data" className="btn-icon" />
              Base
            </button>
          )}
        </div>
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" className="btn-icon" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  };

  const CustomHomeTab = ({ setActiveTab }) => {
    if (userRole === "asesor") {
      return (
        <div className="home-tab">
          <div className="home-buttons">
            <button onClick={() => handleSetActiveTab("tab4")} className="home-btn">
              <img src={icono3} alt="Base" className="btn-icon2" />
              <span>Base</span>
            </button>
          </div>
        </div>
      );
    }
    return <HomeTab setActiveTab={handleSetActiveTab} userRole={userRole} />;
  };

  const renderBaseManagementContent = () => {
    if (selectedBase) {
      return (
        <BaseDataTab
          baseData={selectedBase.datos}
          onBack={handleBackFromDataView}
          onDeleteBase={handleDeleteBase}
          baseId={selectedBase.id}
          baseName={selectedBase.nombre}
          onDataUpdate={handleDataUpdate} 
          userRole={userRole}
          userCargo={userData?.cargo}
        />
      );
    }

    if (selectedAdvisor) {
      const advisorBases = bases.filter(base => base.advisorId === selectedAdvisor.id);

      return (
        <MiBaseTab
          bases={advisorBases}
          onSaveBase={(newBaseData) => handleSaveBase(newBaseData, selectedAdvisor.id)}
          onBaseClick={handleBaseClick}
          onBack={() => {
            setSelectedAdvisor(null);
            setBaseSubTab("baseasesor");
          }}
          subTitle={selectedAdvisor.nombre}
          loading={basesLoading}
        />
      );
    }
    
    switch (baseSubTab) {
      case "mibase":
        // Filtrar bases que pertenecen al usuario actual
        const userBases = bases.filter(base => base.advisorId === userData.id);
        return (
          <MiBaseTab 
            bases={userBases} 
            onSaveBase={(newBaseData) => handleSaveBase(newBaseData, userData.id)}
            onBaseClick={handleBaseClick} 
            onBack={() => setBaseSubTab("main")}
            loading={basesLoading}
          />
        );
      case "baseasesor":
        return (
          <div className="admin-tab">
            <AdvisorBaseTab
              advisorUsers={advisorUsers}
              bases={bases}
              onBack={() => setBaseSubTab("main")}
              onViewBaseClick={(advisor) => {
                setSelectedAdvisor(advisor);
                setSelectedBase(null);
              }}
              loading={basesLoading}
            />
          </div>
        );
      case "revision":
        return (
          <div className="admin-tab">
            <RevisionBaseTab 
              onBack={() => setBaseSubTab("main")} 
            />
          </div>
        );
      default:
        return (
          <BaseManagementTab
            onMiBaseClick={() => setBaseSubTab("mibase")}
            onBaseAsesorClick={() => setBaseSubTab("baseasesor")}
            onRevisionBaseClick={() => setBaseSubTab("revision")}
          />
        );
    }
  };

  const renderContent = () => {
    if (!hasPermission(activeTab)) {
      return (
        <>
          <div className="red-header"></div>
          <div className="tab-content">
            <h1>ACCESO DENEGADO</h1>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        </>
      );
    }
    if (activeTab === "tab2" && userRole !== "administrador") {
      return (
        <>
          <div className="red-header"></div>
          <div className="tab-content">
            <h1>ACCESO DENEGADO</h1>
            <p>Solo los administradores pueden acceder a Gestión de Usuarios.</p>
          </div>
        </>
      );
    }

    const RedHeader = ({ userData, activeTab, userRole }) => {
      const getHeaderTitle = () => {
        switch (activeTab) {
          case "tab1": return "";
          case "tab2": return "";
          case "tab3": return "";
          case "tab4": return userRole === 'asesor'; 
          default: return "DASHBOARD";
        }
      };
      
      return (
        <div className="red-header">
          <div className="header-content">
            <div className="header-title">
              <h1>{getHeaderTitle()}</h1>
            </div>
          
            <div className="user-identifier">
              <div className="user-icon-container">
                <img src={userLoginIcon} alt="Usuario" className="user-icon" />
              </div>
              <div className="user-info">
                <div className="user-role">{userData?.cargo || userData?.tipo?.toUpperCase() || 'USUARIO'}</div>
                <div className="user-name">{userData?.nombre || 'Usuario'}</div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    switch (activeTab) {
      case "tab1":
        return (
          <>
            <RedHeader userData={userData} activeTab={activeTab} />
            <div className="tab-content">
              <h1>INICIO</h1>
              <hr className="divider" />
              <CustomHomeTab setActiveTab={handleSetActiveTab} />
            </div>
          </>
        );
      case "tab2":
        if (userRole !== "administrador") {
          return (
            <>
              <RedHeader userData={userData} activeTab={activeTab} />
              <div className="tab-content">
                <h1>ACCESO DENEGADO</h1>
                <p>Solo administradores pueden acceder a esta sección.</p>
              </div>
            </>
          );
        }
        
        return (
          <>
            <RedHeader userData={userData} activeTab={activeTab} />
            <div className="tab-content">
              <h1>GESTIÓN DE USUARIOS
              {userSubTab === "admin" && <span className="header-subtitle"> - Lista de Administradores</span>}
              {userSubTab === "advisor" && <span className="header-subtitle"> - Lista de Asesores</span>}</h1>
              <hr className="divider" />
              {userSubTab === "main" && (
                <UsersTab 
                  onAdminClick={() => setUserSubTab("admin")} 
                  onAdvisorClick={() => setUserSubTab("advisor")} 
                />
              )}
              {userSubTab === "admin" && <AdminUsersTab onBack={() => setUserSubTab("main")} />}
              {userSubTab === "advisor" && <AdvisorUsersTab onBack={() => setUserSubTab("main")} onDataUpdate={loadAdvisors} />}
            </div>
          </>
        );
      case "tab3":
        return (
          <>
            <RedHeader userData={userData} activeTab={activeTab} />
            <div className="tab-content">                          
              <div className="header-with-actions">
                <h1 className="tab-subtitle">
                  GESTIÓN DE BASE
                  {baseSubTab === "mibase" && <span className="header-subtitle"> - MI BASE</span>}
                  {baseSubTab === "baseasesor" && (
                    <span className="header-subtitle">
                      {" "}
                      - BASE ASESOR
                      {selectedAdvisor && ` (${selectedAdvisor.nombre} ${selectedAdvisor.apellido || ''})`}
                    </span>
                  )}
                  {baseSubTab === "revision" && <span className="header-subtitle"> - REVISIÓN DE BASE</span>}
                </h1>
              </div>
              <hr className="divider" />
              <div className="admin-tab">
              {renderBaseManagementContent()}
              </div>
            </div>
          </>
        );
      case "tab4":
        // Bases que pertenecen al usuario actual (asesor o admin)
        const basesToDisplay = bases.filter(base => base.advisorId === userData?.id);

        if (basesLoading) {
          return (
            <>
              <RedHeader userData={userData} activeTab={activeTab} userRole={userRole} />
              <div className="tab-content">
                <h1 className="tab-subtitle">BASE</h1>
                <hr className="divider" />
                <div className="revising-content-modal2">
                  <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
              </div>
            </>
          );
        }

        return (
          <>
            <RedHeader userData={userData} activeTab={activeTab} userRole={userRole} />
            <div className="tab-content">
              <h1 className="tab-subtitle">BASE</h1>
              <hr className="divider" />
          
                {selectedBase ? (
                  <BaseDataTab
                    baseData={selectedBase.datos}
                    onBack={() => {setSelectedBase(null)}}
                    onDeleteBase={handleDeleteBase}
                    baseId={selectedBase.id}
                    baseName={selectedBase.nombre}
                    onDataUpdate={handleDataUpdate} 
                    userRole={userRole}
                    userCargo={userData?.cargo}
                  />
                ) : (
                  <BaseTab
                    bases={basesToDisplay}
                    onBaseClick={handleBaseClick}
                    loading={basesLoading}
                  />
                )}        
            </div>
          </>
        );
      default:
        return (
          <>
            <RedHeader userData={userData} activeTab={activeTab} />
            <div className="tab-content">
              <h1>INICIO</h1>
              <CustomHomeTab setActiveTab={handleSetActiveTab} />
            </div>
          </>
        );
    }
  };

  return (
    <div className={`dashboard-container ${!isPrivilegedUser() ? 'disable-select-text' : 'enable-select-text'}`}>
      <CustomSidebar setActiveTab={handleSetActiveTab} />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
