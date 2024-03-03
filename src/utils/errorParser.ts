
/** Error Parser
 * 
 * @param error 
 * @returns { errorCode, errorMsg}
 */
export const parseError = (error: any): { errorCode: number, errorMsg: string } => {

    let errorCode = error.status || 500;
    let errorMsg = error.message?.toString()?.trim();

    // catch prisma error
    if ((/prisma/g).test(error.toString()) || (/ECONNREFUSED/).test(error.toString()) || (/database/).test(error.toString())) {
        errorCode = errorCode;
        errorMsg = "PrismaClientInitializationError: Can't reach database server.";
    }

    return { errorCode, errorMsg: errorMsg };
}

