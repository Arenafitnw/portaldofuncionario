
// JSONBIN Config
const JSONBIN_CONFIG = {
  BIN_ID: "680a69b98a456b7966908994",
  X_MASTER_KEY: "$2a$10$RA4z0AoPU7RfLuxk.yeTMum0CpKOT86yytGVhxx/Et5MTHUiaV7SW"
};

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.BIN_ID}`;
const JSONBIN_HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": JSONBIN_CONFIG.X_MASTER_KEY
};

export interface Store {
  id: string;
  name: string;
  employeeCount: number;
}

export interface Employee {
  id: string;
  name: string;
  password: string;
  isAdmin: boolean;
  storeId: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  pdfLink: string;
  storeId: string;
}

// Default data structure
export const getDefaultData = () => {
  return {
    stores: [
      { id: "tacaruna", name: "Tacaruna", employeeCount: 0 },
      { id: "riomar", name: "Riomar", employeeCount: 0 },
      { id: "patteo", name: "Patteo", employeeCount: 0 },
      { id: "northway", name: "North Way", employeeCount: 0 },
      { id: "difusora", name: "Difusora", employeeCount: 0 },
      { id: "caruaru", name: "Caruaru", employeeCount: 0 }
    ],
    employees: [
      { id: "admin", name: "Administrador", password: "admin123", isAdmin: true, storeId: "" }
    ],
    payslips: []
  };
};

// Load data from JSONBIN
export const loadData = async () => {
  try {
    const response = await fetch(JSONBIN_URL, {
      headers: JSONBIN_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const jsonData = await response.json();
    
    if (jsonData.record) {
      // Check if data has valid structure
      if (jsonData.record.stores && jsonData.record.employees) {
        return {
          stores: jsonData.record.stores,
          employees: jsonData.record.employees,
          payslips: jsonData.record.payslips || []
        };
      }
    }
    
    // Use default data
    const defaultData = getDefaultData();
    await saveData(defaultData.stores, defaultData.employees, defaultData.payslips);
    return defaultData;
  } catch (error) {
    console.error("Error loading data:", error);
    
    // Use default data
    const defaultData = getDefaultData();
    return defaultData;
  }
};

// Save data to JSONBIN
export const saveData = async (storesData: Store[], employeesData: Employee[], payslipsData: Payslip[]) => {
  try {
    // Update employee counts
    const updatedStores = storesData.map(store => ({
      ...store,
      employeeCount: employeesData.filter(e => e.storeId === store.id && !e.isAdmin).length
    }));
    
    const dataToSave = {
      stores: updatedStores,
      employees: employeesData,
      payslips: payslipsData
    };
    
    const response = await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: JSONBIN_HEADERS,
      body: JSON.stringify(dataToSave)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
};
