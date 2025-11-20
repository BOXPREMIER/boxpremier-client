import { describe, test, expect, vi, afterEach } from "vitest";
import API from "../services/Api";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePaymentMethod,
} from "../services/UserServices";

vi.mock("../services/Api");

describe("UserServices", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getUsers llama al endpoint /users y retorna los datos", async () => {
    const mockData = { data: { data: [{ id: 1, name: "Alice" }] } };
    API.get.mockResolvedValueOnce(mockData);

    const result = await getUsers();

    expect(API.get).toHaveBeenCalledWith("/users");
    expect(result).toEqual(mockData.data.data);
  });

  test("getUser llama al endpoint correcto y retorna los datos", async () => {
    const mockData = { data: { data: { id: 1, name: "Alice" } } };
    API.get.mockResolvedValueOnce(mockData);

    const result = await getUser(1);

    expect(API.get).toHaveBeenCalledWith("/users/1");
    expect(result).toEqual(mockData.data.data);
  });

  test("createUser llama a POST /users y retorna los datos", async () => {
    const newUser = { name: "Bob" };
    const mockData = { data: { data: { id: 2, ...newUser } } };
    API.post.mockResolvedValueOnce(mockData);

    const result = await createUser(newUser);

    expect(API.post).toHaveBeenCalledWith("/users", newUser);
    expect(result).toEqual(mockData.data.data);
  });

  test("updateUser llama a PUT /users/:id y retorna los datos", async () => {
    const updatedUser = { name: "Charlie" };
    const mockData = { data: { data: { id: 1, ...updatedUser } } };
    API.put.mockResolvedValueOnce(mockData);

    const result = await updateUser(1, updatedUser);

    expect(API.put).toHaveBeenCalledWith("/users/1", updatedUser);
    expect(result).toEqual(mockData.data.data);
  });

  test("deleteUser llama a DELETE /users/:id y retorna los datos", async () => {
    const mockData = { data: { data: { success: true } } };
    API.delete.mockResolvedValueOnce(mockData);

    const result = await deleteUser(1);

    expect(API.delete).toHaveBeenCalledWith("/users/1");
    expect(result).toEqual(mockData.data.data);
  });

  test("updatePaymentMethod llama a PATCH /users/me/payment-method y retorna los datos", async () => {
    const paymentData = { method: "credit_card" };
    const mockData = { data: { data: { success: true } } };
    API.patch.mockResolvedValueOnce(mockData);

    const result = await updatePaymentMethod(paymentData);

    expect(API.patch).toHaveBeenCalledWith("/users/me/payment-method", paymentData);
    expect(result).toEqual(mockData.data.data);
  });
});
