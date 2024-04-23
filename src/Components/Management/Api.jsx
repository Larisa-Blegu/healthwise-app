import axios from "axios";

export async function deleteRow(url) {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function updateRow(url, data) {
  const token = localStorage.getItem("token");
  try {
    await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function addRow(url, data) {
  const token = localStorage.getItem("token");
  try {
    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
}
