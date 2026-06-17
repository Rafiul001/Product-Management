import type { ValidatedRequest } from "@server/middleware/validator.js";
import { CronSettingsModel } from "@shared/models/CronSettings.js";
import { ok } from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type { TCronSettingsBodySchema } from "@shared/validators/order.validator.js";

export const getCronSettingsController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    let settings = await CronSettingsModel.findOne().lean();
    if (!settings) {
      const created = await CronSettingsModel.create({
        startHour: 9,
        endHour: 17,
      });
      settings = created.toObject();
    }
    return ok(res, undefined, settings);
  },
);

export const updateCronSettingsController = asyncController<
  ValidatedRequest<{ body: TCronSettingsBodySchema }>
>(async (req, res) => {
  const { startHour, endHour } = req.validatedBody;

  if (startHour >= endHour)
    return res
      .status(400)
      .json({ message: "startHour must be less than endHour" });

  const settings = await CronSettingsModel.findOneAndUpdate(
    {},
    { $set: { startHour, endHour } },
    { upsert: true, new: true },
  ).lean();

  return ok(res, "Cron settings updated", settings);
});
