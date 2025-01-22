export const checkIsFileShared = async (name) => {
  try {
    const response = await fetch("http://localhost:3000/dashboard/is-shared", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    });
    if (response.ok) {
      const data = await response.json();
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
  }
};
