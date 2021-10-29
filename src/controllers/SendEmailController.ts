import { json, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRespository";
import { SurveysUsersRepository } from "../repositories/SurveyUserRespository";
import { UsersRepository } from "../repositories/UserRespository";


class SendEmailController{

    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;
        const userRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await userRepository.findOne({email});
        if (!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists!"
            });
        }

        const surveyAlreadyExists = await surveyRepository.findOne({id: survey_id});
        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: "Survey does not exists!"
            });
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id: surveyAlreadyExists.id
        });

        await surveyUserRepository.save(surveyUser)
        return response.json(surveyUser)
    }

    async create(request: Request, response: Response){
        const { user_id, survey_id, value } = request.body;
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const survey = surveyUserRepository.create({
            user_id,
            survey_id,
            value
        })
        await surveyUserRepository.save(survey)
        return response.status(201).json(survey)
    }

    async show(request: Request, response: Response){
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveyUserRepository.find()
        return response.json(surveysUsers)
    }
}

export { SendEmailController };