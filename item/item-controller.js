import ItemService from "./item-service.js";
import { isNotEmptyArray, isString } from "../utils.js";
import { isCorrecetStatus, isNotEmpty } from "../../utis.js";
export default class ItemController {
  constructor() {
    this.service = new ItemService();
  }
  getItem = async (ctx) => {
        const{id} = ctx.query;
    const res = await this.service.getOne(id);
    ctx.status = 200;
    ctx.body={
      data:res,
    }
    return this.service.getOne();
  };
  getItems = async (ctx) => {
    const{ids} = ctx.query;
    const res = await this.service.getAll({ids});
    ctx.status = 200;
    ctx.body={
      data:res,
    }
    return this.service.getAll();
  };
  deleteItem = async (ctx) => {
    const {id} = ctx.params;
    return this.service.softDelete(id);
    ctx.status =200;
    ctx.body = {
      status: 200,
      message: 'OK,'
    };
  }
  updateItem = async (ctx) => {
    const { id } = ctx.params;
    const {
      name,
      properties,
      status,
      category_id,
      expected_location_id,
      actual_location_id,
    } = ctx.request.body;

    const res = thix.service.update(id, {
      name,
      properties,
      status,
      category_id,
      expected_location_id,
      actual_location_id,
    });

    ctx.status = 200;
    ctx.body = {
      data: res,
    };

    return this.service.update();
  };
  createItem = async (ctx) => {
    const {
      name,
      properties,
      status,
      category_id,
      expected_location_id,
      actual_location_id,
    } = ctx.request.body;

    if (
      isNotEmpty(name) ||
      isNotEmpty(properties) ||
      isNotEmpty(status) ||
      isCorrecetStatus(ItemStatus, status) ||
      isNotEmpty(actual_location_id) ||
      isNotEmpty(expected_location_id) ||
      isNotEmpty(category_id)
    ) {
      const res = this.service.create(
        name,
        properties,
        status,
        actual_location_id,
        expected_location_id,
        category_id,
      );

      ((ctx.status = 201),
        (ctx.body = {
          data: res,
        }));
      return;
    }

    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: "Переданны неверные клиентские данные",
    };
    return this.service.create();
  };
}
