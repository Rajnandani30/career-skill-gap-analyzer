const express = require("express");
const Roadmap = require("../models/Roadmap");
const Analysis = require("../models/Analysis");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const {
    generateLearningRoadmap
} = require("../services/aiService");

const {
    sendCareerAIEmail
} = require("../services/emailService");

const router = express.Router();


/*
 * =========================================================
 * GENERATE LEARNING ROADMAP
 * =========================================================
 *
 * POST /api/roadmap
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { analysisId } = req.body;

        if (!analysisId) {
            return res.status(400).json({
                success: false,
                message: "Analysis ID is required."
            });
        }

        const analysis = await Analysis.findOne({
            _id: analysisId,
            userId: req.userId
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found."
            });
        }

        const existingRoadmap = await Roadmap.findOne({
            analysisId,
            userId: req.userId
        });

        if (existingRoadmap) {
            return res.status(200).json({
                success: true,
                message: "Learning roadmap already exists.",
                roadmap: existingRoadmap
            });
        }

        if (
            !analysis.missingSkills ||
            analysis.missingSkills.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "No skill gaps were found for this analysis."
            });
        }

        const generatedRoadmap =
            await generateLearningRoadmap({
                targetRole: analysis.targetRole,
                missingSkills: analysis.missingSkills
            });

        const roadmapDocument = new Roadmap({
            userId: req.userId,
            analysisId: analysis._id,
            targetRole: analysis.targetRole,
            skills: analysis.missingSkills,
            roadmap: generatedRoadmap.roadmap || []
        });

        const savedRoadmap =
            await roadmapDocument.save();


        /*
         * =====================================================
         * AUTOMATIC ROADMAP EMAIL NOTIFICATION
         * =====================================================
         *
         * Email is sent only when:
         * - User exists
         * - User has a registered email
         * - Email updates are enabled
         * - Notifications are enabled
         *
         * If email fails, roadmap generation still succeeds.
         */
        try {
            const user = await User.findById(req.userId).select(
                "name email emailUpdates notifications"
            );

            if (
                user &&
                user.email &&
                user.emailUpdates &&
                user.notifications
            ) {
                await sendCareerAIEmail({
                    to: user.email,
                    subject:
                        "Your CareerAI Learning Roadmap Is Ready",
                    title:
                        "Learning Roadmap Generated Successfully!",
                    message:
                        `Hello ${user.name || "CareerAI User"},\n\n` +
                        `Your personalized learning roadmap for the role ` +
                        `"${analysis.targetRole}" has been generated successfully.\n\n` +
                        `You can now open CareerAI and start working on your identified skill gaps.\n\n` +
                        `Keep learning and improving your career readiness!`
                });

                console.log(
                    `Roadmap email sent successfully to ${user.email}`
                );
            } else {
                console.log(
                    "Roadmap email skipped because notifications or email updates are disabled."
                );
            }
        } catch (emailError) {
            console.error(
                "Roadmap email notification error:",
                emailError.message
            );
        }


        res.status(201).json({
            success: true,
            message:
                "AI learning roadmap generated successfully.",
            roadmap: savedRoadmap
        });

    } catch (error) {
        console.error(
            "Generate roadmap error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate learning roadmap.",
            error: error.message
        });
    }
});


/*
 * =========================================================
 * UPDATE ROADMAP STEP PROGRESS
 * =========================================================
 *
 * PATCH /api/roadmap/:roadmapId/step
 */
/*
 * =========================================================
 * UPDATE ROADMAP STEP PROGRESS
 * =========================================================
 *
 * PATCH /api/roadmap/:roadmapId/step
 *
 * Sends:
 * 1. A milestone email when all steps of a skill are completed.
 * 2. A final email when the entire roadmap is completed.
 */
router.patch(
    "/:roadmapId/step",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                skillIndex,
                stepIndex,
                completed
            } = req.body;

            if (
                skillIndex === undefined ||
                stepIndex === undefined ||
                completed === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Skill index, step index and completion status are required."
                });
            }

            const roadmap = await Roadmap.findOne({
                _id: req.params.roadmapId,
                userId: req.userId
            });

            if (!roadmap) {
                return res.status(404).json({
                    success: false,
                    message: "Roadmap not found."
                });
            }

            if (
                !roadmap.roadmap[skillIndex] ||
                !roadmap.roadmap[skillIndex].steps[stepIndex]
            ) {
                return res.status(404).json({
                    success: false,
                    message: "Roadmap step not found."
                });
            }

            const selectedSkill =
                roadmap.roadmap[skillIndex];

            const selectedStep =
                selectedSkill.steps[stepIndex];

            const wasAlreadyCompleted =
                selectedStep.completed;

            selectedStep.completed = Boolean(completed);

            await roadmap.save();


            /*
             * =====================================================
             * PROGRESS EMAIL NOTIFICATIONS
             * =====================================================
             *
             * Emails are checked only when a step is marked
             * as completed.
             */
            if (
                Boolean(completed) &&
                !wasAlreadyCompleted
            ) {
                try {
                    const user = await User.findById(
                        req.userId
                    ).select(
                        "name email emailUpdates notifications"
                    );

                    if (
                        user &&
                        user.email &&
                        user.emailUpdates &&
                        user.notifications
                    ) {
                        /*
                         * -------------------------------------------------
                         * CHECK WHETHER THE CURRENT SKILL IS COMPLETED
                         * -------------------------------------------------
                         */
                        const skillCompleted =
                            selectedSkill.steps.length > 0 &&
                            selectedSkill.steps.every(
                                (step) => step.completed === true
                            );

                        let milestoneEmailSent = false;

                        if (skillCompleted) {
                            const skillName =
                                selectedSkill.skill;

                            const alreadySent =
                                roadmap.completedMilestoneEmails.includes(
                                    skillName
                                );

                            if (!alreadySent) {
                                await sendCareerAIEmail({
                                    to: user.email,
                                    subject:
                                        `CareerAI Milestone Achieved: ${skillName}`,
                                    title:
                                        "Learning Milestone Achieved!",
                                    message:
                                        `Hello ${user.name || "CareerAI User"},\n\n` +
                                        `Congratulations! You have completed the "${skillName}" learning module in your ${roadmap.targetRole} roadmap.\n\n` +
                                        `This is an important milestone in your career-readiness journey. Continue working on the remaining skills to strengthen your profile.\n\n` +
                                        `Keep learning and growing with CareerAI!`
                                });

                                roadmap.completedMilestoneEmails.push(
                                    skillName
                                );

                                milestoneEmailSent = true;

                                console.log(
                                    `Milestone email sent for ${skillName} to ${user.email}`
                                );
                            }
                        }


                        /*
                         * -------------------------------------------------
                         * CHECK WHETHER THE ENTIRE ROADMAP IS COMPLETED
                         * -------------------------------------------------
                         */
                        const entireRoadmapCompleted =
                            roadmap.roadmap.length > 0 &&
                            roadmap.roadmap.every(
                                (skillModule) =>
                                    skillModule.steps.length > 0 &&
                                    skillModule.steps.every(
                                        (step) =>
                                            step.completed === true
                                    )
                            );

                        let finalRoadmapEmailSent = false;

                        if (
                            entireRoadmapCompleted &&
                            !roadmap.roadmapCompletionEmailSent
                        ) {
                            await sendCareerAIEmail({
                                to: user.email,
                                subject:
                                    "CareerAI Roadmap Completed Successfully!",
                                title:
                                    "Congratulations! Your Entire Roadmap Is Complete!",
                                message:
                                    `Hello ${user.name || "CareerAI User"},\n\n` +
                                    `Amazing work! You have completed your entire learning roadmap for the role "${roadmap.targetRole}".\n\n` +
                                    `You have successfully worked through all the learning modules and their steps.\n\n` +
                                    `Keep applying your knowledge through projects, practice, and interview preparation.\n\n` +
                                    `Congratulations on completing this important career-readiness milestone!`
                            });

                            roadmap.roadmapCompletionEmailSent =
                                true;

                            finalRoadmapEmailSent = true;

                            console.log(
                                `Final roadmap completion email sent to ${user.email}`
                            );
                        }

                        if (
                            milestoneEmailSent ||
                            finalRoadmapEmailSent
                        ) {
                            await roadmap.save();
                        }
                    } else {
                        console.log(
                            "Progress email skipped because notifications or email updates are disabled."
                        );
                    }
                } catch (emailError) {
                    /*
                     * Email errors must not stop progress updates.
                     */
                    console.error(
                        "Progress email notification error:",
                        emailError.message
                    );
                }
            }


            res.status(200).json({
                success: true,
                message:
                    "Roadmap progress updated successfully.",
                roadmap
            });

        } catch (error) {
            console.error(
                "Update roadmap progress error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to update roadmap progress.",
                error: error.message
            });
        }
    }
);
        
         
      
     
  


/*
 * =========================================================
 * GET ALL ROADMAPS
 * =========================================================
 *
 * GET /api/roadmap
 */
router.get(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const roadmaps =
                await Roadmap.find({
                    userId: req.userId
                })
                    .populate(
                        "analysisId",
                        "targetRole matchScore"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.status(200).json({
                success: true,
                roadmaps
            });

        } catch (error) {
            console.error(
                "Get roadmaps error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch learning roadmaps.",
                error: error.message
            });
        }
    }
);


/*
 * =========================================================
 * GET SINGLE ROADMAP
 * =========================================================
 *
 * GET /api/roadmap/:id
 */
router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const roadmap =
                await Roadmap.findOne({
                    _id: req.params.id,
                    userId: req.userId
                }).populate(
                    "analysisId",
                    "targetRole matchScore"
                );

            if (!roadmap) {
                return res.status(404).json({
                    success: false,
                    message: "Roadmap not found."
                });
            }

            res.status(200).json({
                success: true,
                roadmap
            });

        } catch (error) {
            console.error(
                "Get roadmap error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch roadmap.",
                error: error.message
            });
        }
    }
);


module.exports = router;