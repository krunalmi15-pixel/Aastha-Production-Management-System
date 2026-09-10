const API_URL = "https://aastha-backend-fucs.onrender.com/api";

export const authAPI = {

  login: async(data:{
    email:string;
    password:string;
  }) => {

    const res = await fetch(
      `${API_URL}/auth/login`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      }
    );

    if(!res.ok){
      throw new Error("Login failed");
    }

    return res.json();

  }

};

export const api = {
  get: async (url:string, options:any = {}) => {

    const query =
      options.params
      ?
      "?" + new URLSearchParams(options.params).toString()
      :
      "";

    const response = await fetch(
      `${API_URL}${url}${query}`
    );

    return response;
  }
};

export const employeeAPI = {
  getAll: async () => {
    const response = await fetch(
      `${API_URL}/employees`
    );
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(
      `${API_URL}/employees`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  update: async (
    id: string,
    data: any
  ) => {
    const response = await fetch(
      `${API_URL}/employees/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  delete: async (
    id: string
  ) => {
    const response = await fetch(
      `${API_URL}/employees/${id}`,
      {
        method: "DELETE",
      }
    );
    return response.json();
  },

  attendance: {
    getAll: async () => {
      const response = await fetch(
        `${API_URL}/attendance`
      );
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(
        `${API_URL}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    delete: async (
      id: string
    ) => {
      const response = await fetch(
        `${API_URL}/attendance/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    }
  },

  machines: {
    getAll: async () => {
      const response = await fetch(
        `${API_URL}/machines`
      );
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(
        `${API_URL}/machines`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    update: async (
      id: string,
      data: any
    ) => {
      const response = await fetch(
        `${API_URL}/machines/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    delete: async (
      id: string
    ) => {
      const response = await fetch(
        `${API_URL}/machines/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    }
  },

  items: {
    getAll: async () => {
      const response = await fetch(
        `${API_URL}/items`
      );
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(
        `${API_URL}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    update: async (
      id: string,
      data: any
    ) => {
      const response = await fetch(
        `${API_URL}/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    delete: async (
      id: string
    ) => {
      const response = await fetch(
        `${API_URL}/items/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    }
  },

  lots: {
    getAll: async () => {
      const response = await fetch(
        `${API_URL}/lots`
      );
      return response.json();
    },

    getByBarcode: async (
      barcode: string
    ) => {
      const response = await fetch(
        `${API_URL}/lots/${barcode}`
      );
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(
        `${API_URL}/lots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    update: async (
      id: string,
      data: any
    ) => {
      const response = await fetch(
        `${API_URL}/lots/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },

    delete: async (
      id: string
    ) => {
      const response = await fetch(
        `${API_URL}/lots/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    }
  }
};

export const productionAPI = {
  create: async (data: any) => {
    const response = await fetch(
      `${API_URL}/productions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(
      `${API_URL}/productions`
    );
    return response.json();
  },

  getByLotId: async (lotId: string) => {
    const response = await fetch(
      `${API_URL}/productions/lot/${lotId}`
    );
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(
      `${API_URL}/productions/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }
};

export const lotAPI = {
  getAll: async () => {
    const response = await fetch(
      `${API_URL}/lots`
    );
    return response.json();
  },

  getCreated: async () => {
    const response = await fetch(
      `${API_URL}/lots/created`
    );
    return response.json();
  },

  getCompleted: async (date?: string) => {
    const url = date
      ? `${API_URL}/lots/completed?date=${date}`
      : `${API_URL}/lots/completed`;

    const response = await fetch(url);
    return response.json();
  },

  nextNumber: async () => {
    const response = await fetch(
      `${API_URL}/lots/next-number`
    );

    return response.json();
  },

  getByBarcode: async (
    barcode: string
  ) => {
    const response = await fetch(
      `${API_URL}/lots/${barcode}`
    );
    return response.json();
  },

  create: async (
    data: any
  ) => {
    const response = await fetch(
      `${API_URL}/lots`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  update: async (
    id: string | number,
    data: any
  ) => {
    const response = await fetch(
      `${API_URL}/lots/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  print: async (
    id: string
  ) => {
    const response = await fetch(
      `${API_URL}/lots/${id}/print`,
      {
        method: "POST",
      }
    );

    return response.json();
  },

  delete: async (
    id: string
  ) => {
    const response = await fetch(
      `${API_URL}/lots/${id}`,
      {
        method: "DELETE",
      }
    );

    return response.json();
  },
};

export const machineAPI = employeeAPI.machines;

export const itemAPI = employeeAPI.items;

export const employeeMasterAPI = employeeAPI;

export const dashboardAPI = {
  get: async () => {
    const response = await fetch(
      `${API_URL}/dashboard`
    );
    return response.json();
  }
};

export const reportAPI = {
  getProduction: async (params: any) => {
    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
      status: params.status
    });

    const response = await fetch(
      `${API_URL}/reports/production?${query}`
    );
    return response.json();
  },

  getTodayProduction: async (status: string) => {
    const response = await fetch(
      `${API_URL}/reports/today?status=${status}`
    );
    return response.json();
  }
};

export const attendanceAPI = {
  getAll: async () => {
    const response = await fetch(
      `${API_URL}/attendance`
    );
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(
      `${API_URL}/attendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(
      `${API_URL}/attendance/${id}`,
      {
        method: "DELETE",
      }
    );
    return response.json();
  }
};

export const settingsAPI = {
  get: async () => {
    const response = await fetch(
      `${API_URL}/settings`
    );
    return response.json();
  },

  update: async (data: any) => {
    const response = await fetch(
      `${API_URL}/settings`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }
};