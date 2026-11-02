import "dotenv/config"
import Redis from 'redis'
import * as readline from "node:readline/promises"
import {stdin,stdout} from "node:process"
import {ChatOpenAI} from "@langchain/openai"
import {
    creatAgent,HumanMessage,summarizationMiddleware
}from "langchain"
import  {
    mapChatMessageToStoredMessages,
    mapStoredMessagesToChatMessage,
}from "@langchain/core/messages"
