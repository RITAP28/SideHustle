import { Request, Response } from "express";
import { prisma } from "db";
import { wss } from "../webproject.server";
import * as pty from 'node-pty';
import fs from 'fs';

export const handleCreateBlankProject = async (req: Request, res: Response) => {
    try {
        const { projectName, userId, userName, description } = req.body;

        const existingProject = await prisma.project.findUnique({
            where: {
                projectName_userId: {
                    projectName: projectName,
                    userId: userId
                }
            }
        });

        if(existingProject){
            return res.status(409).json({
                success: false,
                msg: "Project already exists"
            });
        };

        const link = `/webproject?userId=${userId}&project=${projectName}`;

        const newProject = await prisma.project.create({
            data: {
                projectName: projectName,
                userId: userId,
                link: link,
                userName: userName,
                description: description,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now())
            }
        });
        console.log("Info about the new project: ", newProject);

        const projectLocation = process.cwd() + '/projects' + `/${projectName}`;
        if(!fs.existsSync(projectLocation)){
            fs.mkdirSync(projectLocation, {
                recursive: true
            })
        };

        const initialFile = await prisma.webdevFile.create({
            data: {
                filename: 'README.md',
                content: `# Welcome to your new project ${projectName}\n\nThis is your project README.md, edit it as you wish.`,
                path: process.cwd() + `/projects/${projectName}/README.md`,
                template: '.md',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                projectId: newProject.projectId,
                userId: userId,
                userName: userName
            }
        });
        console.log("Info about readme file: ", initialFile);

        if(!fs.existsSync(initialFile.path)){
            fs.writeFile(initialFile.path, initialFile.content, (err) => {
                if(err) throw err;
            });
        };

        // opening a socket connection connecting the client and the server having the project as the bridge
        wss.on('connection', function connection(ws) {
            ws.on('error', (error) => {
                console.error('Error while establishing a websocket connection: ', error);
            });
        
            console.log('pty: ', pty);
            console.log('working directory: ', process.env.INIT_CWD);
        
            if(!pty || !pty.spawn){
                console.error('pty spawn is not defined');
                return;
            };
        
            const ptyProcess = pty.spawn('zsh', [], {
                name: 'xterm-zsh',
                cols: 80,
                rows: 30,
                cwd: process.env.INIT_CWD + `/projects/${projectName}`,
                env: process.env
            });
        
            ptyProcess.onData(data => {
                console.log('sending data to client: ', data);
                ws.send(data);
            });
        
            ws.emit('files:refresh');
        
            ws.on('files:change' ,({ path, content }) => {
                fs.writeFile(`./projects/${projectName}/${path}`, content, (err) => {
                    if(err){
                        console.error(err);
                    } else {
                        console.log('all ok');
                    }
                });
            })
        
            ws.on('message', (data: string) => {
                console.log('received data from the client: ', data);
                ptyProcess.write(data + '\r');
            });
        
            ws.on('close', () => {
                ptyProcess.kill();
            });
        });

        return res.status(200).json({
            success: true,
            msg: "Project created successfully!",
            link: link
        });
    } catch (error) {
        console.error("error in creating blank project: ", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

export const handleReturnCWD = async (req: Request, res: Response) => {
    try {
        const cwd = process.cwd();
        return res.status(200).json({
            success: true,
            cwd: cwd
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

export const handleGetProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: Number(req.query.userId)
            }
        });
        if(!projects){
            return res.status(404).json({
                success: false,
                msg: "Projects not found"
            });
        };
        console.log(projects);
        return res.status(200).json({
            success: true,
            msg: "Projects found successfully",
            projects
        });
    } catch (error) {
        console.error("Error while fetching projects: ", error);
    };
};