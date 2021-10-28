import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRespository";


class SurveyController{
    async create(request: Request, response: Response){
        const { title, description } = request.body;
        const surveyRepoository = getCustomRepository(SurveysRepository);

        const survey = surveyRepoository.create({
            title,
            description
        })
        await surveyRepoository.save(survey)
        return response.status(201).json(survey)
    }

    async show(request: Request, response: Response){
        const surveyRepoository = getCustomRepository(SurveysRepository);

        const surveys = await surveyRepoository.find()
        return response.json(surveys)
    }
}

export { SurveyController };