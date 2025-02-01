-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `aiModel` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TokenUsage` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `inputTokens` INTEGER NOT NULL,
    `inputCostPerToken` DOUBLE NOT NULL,
    `inputTotalCost` DOUBLE NOT NULL,
    `outputTokens` INTEGER NOT NULL,
    `outputCostPerToken` DOUBLE NOT NULL,
    `outputTotalCost` DOUBLE NOT NULL,
    `totalTokens` INTEGER NOT NULL,
    `totalCost` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TokenUsage_lessonId_key`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TokenUsage` ADD CONSTRAINT `TokenUsage_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
