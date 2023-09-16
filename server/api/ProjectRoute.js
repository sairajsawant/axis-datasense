const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
const _ = require("lodash");

const ProjectController = require("../controllers/ProjectController");
const TeamController = require("../controllers/TeamController");
const verifyToken = require("../modules/verifyToken");
const accessControl = require("../modules/accessControl");
const refreshChartsApi = require("../modules/refreshChartsApi");
const getUserFromToken = require("../modules/getUserFromToken");

const autoFieldSelector = require("./autoFieldSelector");
const fieldFinder = require("./fieldFinder");

const typeorm = require("typeorm");
const { OpenAI } = require("langchain/llms/openai");
const { SqlDatabase } = require("langchain/sql_db");
const { SqlDatabaseChain } = require("langchain/chains/sql_db");
const { PromptTemplate } = require("langchain/prompts");

module.exports = (app) => {
  const projectController = new ProjectController();
  const teamController = new TeamController();

  const getQuery = async (question) => {
    const datasource = new typeorm.DataSource({
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "sairaj111",
      database: "data_kra",
    })

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      includesTables: ['Employees', 'Persona', 'contacthistory', 'Customers', 'RM_KRAs', 'Product_Holding']
    });

    const SQL_SQLITE_PROMPT = new PromptTemplate({
      template: `You are a SQLite expert. Given an input question, first create a syntactically correct SQLite query to run, then look at the results of the query and return the answer to the input question.
    Unless the user specifies in the question a specific number of examples to obtain, query for at most {top_k} results using the LIMIT clause as per SQLite. You can order the results to return the most informative data in the database.
    Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
    Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
    
    Use the following format:
    
    Question: "Question here"
    SQLQuery: "SQL Query to run"
    SQLResult: "Result of the SQLQuery"
    Answer: "Final answer here"
    
    Only use the following tables:
    {table_info}
  
    Question: {input}`,
      inputVariables: ["dialect", "table_info", "input", "top_k"],
    });

    const chain = new SqlDatabaseChain({
      llm: new OpenAI({ temperature: 0, openAIApiKey: "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" }),
      database: db,
      sqlOutputKey: "query",
      prompt: SQL_SQLITE_PROMPT
    });

    const res = await chain.call({ "query": question });
    console.log(res);

    return res
  }

  const getReccomendations = async (role) => {
    if (role == "owner") return

    const datasource = new typeorm.DataSource({
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "sairaj111",
      database: "data_kra",
    })

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      includesTables: ['Employees', 'Persona', 'contacthistory', 'Customers', 'RM_KRAs', 'Product_Holding']
    });

    const SQL_SQLITE_PROMPT = new PromptTemplate({
      template: `You are expected to give recommendations based on the tables provided. 
      The data is related to a bank with RMs and based on customer data, give 5 recommendations how he can better meet his targets.
      
      Question: "Question here"
      SQLQuery: "SQL Query to run"
      SQLResult: Strictly follow format - in an array of JSON with title field as Recommendation #number and description and give clean result without newlines
      Answer: Strictly follow format - in an array of description and give clean result without newline characters("\n")
  
      Question: {input}`,
    });

    const chain = new SqlDatabaseChain({
      llm: new OpenAI({ temperature: 0, openAIApiKey: "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" }),
      database: db,
      sqlOutputKey: "query",
      prompt: SQL_SQLITE_PROMPT
    });

    const res = await chain.call({ "query": question });
    console.log(res);

    return res
  }

  const generateChartWorkFlow = async (query) => {

    //create chart
    const createChartResponse = await fetch("http://localhost:4019/project/2/chart", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"type\":\"line\",\"subType\":\"lcTimeseries\",\"name\":\"Final Chart Sairaj Shubham 3\"}",
      "method": "POST"
    });
    const createChart = await createChartResponse.json();
    console.log(createChart.id)
    const chartId = createChart.id
    console.log("chartId", chartId)
    //create dataset
    const createDatasetResponse = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataset`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"chart_id\":\"${chartId}\",\"legend\":\"Dataset #1\",\"datasetColor\":\"#D62728\",\"fillColor\":[\"rgba(0,0,0,0)\"]}`,
      "method": "POST"
    });
    const createDataset = await createDatasetResponse.json();
    console.log(createDataset)
    const datasetId = createDataset.id
    console.log("datasetId", datasetId)

    const putDatasetResponse = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataset/${datasetId}`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": JSON.stringify(createDataset),
      "method": "PUT"
    });

    const putDataset = await putDatasetResponse.json();
    console.log(putDataset)
    //may need get dataset call?

    const createDataRequest = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataRequest`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"dataset_id\":${datasetId},\"connection_id\":3}`,
      "method": "POST"
    });
    const createData = await createDataRequest.json();
    console.log(createData)

    const mainDRId = createData.id
    console.log("mainDRId", mainDRId)
    //may need dataset id?

    const putMainDRId = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataset/${datasetId}`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"main_dr_id\":${mainDRId}}`,
      "method": "PUT"
    });

    const mainDRIdPutResponse = await putMainDRId.json();
    console.log(mainDRIdPutResponse)
    //saved query not done

    //sure main dr id?
    const putDataRequest = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataRequest/${mainDRId}`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"query\":\"${query}\",\"headers\":null,\"body\":null,\"conditions\":null,\"configuration\":null,\"id\":${mainDRId},\"dataset_id\":${datasetId},\"connection_id\":3,\"method\":null,\"route\":null,\"useGlobalHeaders\":true,\"pagination\":false,\"items\":\"items\",\"itemsLimit\":0,\"offset\":\"offset\",\"paginationField\":null,\"template\":null,\"createdAt\":\"2023-09-15T09:42:53.000Z\",\"updatedAt\":\"2023-09-15T09:42:53.000Z\",\"Connection\":{\"host\":null,\"id\":3,\"name\":\"sample\",\"type\":\"postgres\",\"subType\":\"postgres\"}}`,
      "method": "PUT"
    });

    const putDataRequestResponse = await putDataRequest.json();
    console.log(putDataRequestResponse)

    const requestCall = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataRequest/${mainDRId}/request`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "http://localhost:3003/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"getCache\":false}",
      "method": "POST"
    });

    const requestCallResponse = await requestCall.json();
    console.log(requestCallResponse)

    const requestResult = requestCallResponse.dataRequest.responseData.data
    if (requestResult) {
      let tempFieldOptions = [];
      const tempObjectOptions = [];
      const fieldsSchema = {};
      const updateObj = {};

      const fields = fieldFinder.init(requestResult);
      const objectFields = fieldFinder.init(requestResult, false, true);

      fields.forEach((o) => {
        if (o.field) {
          let text = o.field && o.field.replace("root[].", "").replace("root.", "");
          if (o.type === "array") text += "(get element count)";
          tempFieldOptions.push({
            key: o.field,
            text: o.field && text,
            value: o.field,
            type: o.type,
            label: {
              style: { width: 55, textAlign: "center" },
              content: o.type || "unknown",
              size: "mini",
              color: o.type === "date" ? "secondary"
                : o.type === "number" ? "primary"
                  : o.type === "string" ? "success"
                    : o.type === "boolean" ? "warning"
                      : "default"
            },
          });
        }
        fieldsSchema[o.field] = o.type;
      });

      objectFields.forEach((obj) => {
        if (obj.field) {
          let text = obj.field && obj.field.replace("root[].", "").replace("root.", "");
          if (obj.type === "array") text += "(get element count)";
          tempObjectOptions.push({
            key: obj.field,
            text: obj.field && text,
            value: obj.field,
            type: obj.type,
            isObject: true,
            label: {
              style: { width: 55, textAlign: "center" },
              content: obj.type || "unknown",
              size: "mini",
              color: obj.type === "date" ? "secondary"
                : obj.type === "number" ? "primary"
                  : obj.type === "string" ? "success"
                    : obj.type === "boolean" ? "warning"
                      : "default"
            },
          });
        }
        fieldsSchema[obj.field] = obj.type;
      });

      if (Object.keys(fieldsSchema).length > 0) updateObj.fieldsSchema = fieldsSchema;

      tempFieldOptions = tempFieldOptions.concat(tempObjectOptions);

      // setFieldOptions(tempFieldOptions);

      // initialise values for the user if there were no prior selections
      const autoFields = autoFieldSelector.autoFieldSelector(tempFieldOptions);
      Object.keys(autoFields).forEach((key) => {
        //   if (!dataset[key]) updateObj[key] = autoFields[key];
        updateObj[key] = autoFields[key]
      });

      // update the operation only if the xAxis and yAxis were not set initially
      // if (!dataset.xAxis && !dataset.yAxis && autoFields.yAxisOperation) {
      updateObj.yAxisOperation = autoFields.yAxisOperation;
      // }

      if (Object.keys(updateObj).length > 0) {
        console.log(updateObj);
        const putDatasetSemiFinalCall = await fetch(`http://localhost:4019/project/2/chart/${chartId}/dataset/${datasetId}`, {
          "headers": {
            "accept": "application/json",
            "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "http://localhost:3003/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": JSON.stringify(updateObj),
          "method": "PUT"
        });
        const putDatasetSemiFinal = await putDatasetSemiFinalCall.json();
        console.log(putDatasetSemiFinal)


        const finalChartCall = await fetch(`http://localhost:4019/project/2/chart/${chartId}/query?no_source=false&skip_parsing=false&getCache=true`, {
          "headers": {
            "accept": "application/json",
            "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr;q=0.6",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImVtYWlsIjoic2FpcmFqc2F3YW50MzA0NUBnbWFpbC5jb20iLCJpYXQiOjE2OTQ3NDE1NTksImV4cCI6MTY5NzMzMzU1OX0.-Sc8CexwCExSj_J-PY9mWaN-x8beoJBy6XjOp8Nls9o",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "http://localhost:3003/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": "{}",
          "method": "POST"
        });

        const finalChart = await finalChartCall.json();
        console.log(finalChart)
      }
    }
  }

  const checkAccess = (req) => {
    const teamId = req.params.team_id || req.body.team_id || req.query.team_id;

    if (req.params.id) {
      return projectController.findById(req.params.id)
        .then((project) => {
          return teamController.getTeamRole(project.team_id, req.user.id);
        })
        .then((teamRole) => {
          // the owner has access to all the projects
          if (teamRole.role === "owner") return teamRole;

          // otherwise, check if the team role contains access to the right project
          if (!teamRole.projects) return Promise.reject(401);
          const filteredProjects = teamRole.projects.filter((o) => `${o}` === `${req.params.id}`);
          if (filteredProjects.length === 0) {
            return Promise.reject(401);
          }

          return teamRole;
        });
    }

    return teamController.getTeamRole(teamId, req.user.id);
  };

  app.get("/project/:question", verifyToken, async (req, res) => {
    console.log("askBot triggered" + req.params.question)
    const a = await getQuery(req.params.question)
    return res.status(200).send(a);
  });

  app.get("/project/addChart/:question", verifyToken, async (req, res) => {
    console.log("addChart triggered" + req.params.question)
    const a = await getQuery(req.params.question)
    const createChart = await generateChartWorkFlow(a.result)
    return res.status(200).send(a);
  });

  app.get("/project/recommendations/suggest", verifyToken, async (req, res) => {
    console.log("getReccomendations triggered")
    res.status(200).json([
      {
        "title": "Recommendation #1",
        "description": "Encourage Aarav Sharma to focus on customers with higher net worth and higher loan amounts as they are more likely to generate higher profits for the bank."
      },
      {
        "title": "Recommendation #2",
        "description": "Encourage Aarav Sharma to focus on customers with higher credit scores as they are more likely to be approved for loans and generate higher profits for the bank."
      },
      {
        "title": "Recommendation #3",
        "description": "Encourage Aarav Sharma to focus on customers with higher savings balances as they are more likely to be interested in investing and generate higher profits for the bank."
      },
      {
        "title": "Recommendation #4",
        "description": "Encourage Aarav Sharma to focus on customers with higher incomes as they are more likely to be able to afford higher loan amounts and generate higher profits for the bank."
      },
      {
        "title": "Recommendation #5",
        "description": "Encourage Aarav Sharma to focus on customers with longer banking histories."
      }
    ])
    // checkAccess(req)
    //   .then((teamRole) => {
    //     console.log("getReccomendations " + teamRole.role)
    //     const recommendations = getReccomendations()
    //     if (role == "owner") {
    //     }
    //   })
  });

  /*
  ** [MASTER] Route to get all the projects
  */
  app.get("/project", verifyToken, (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send({ error: "Not authorized" });
    }

    return projectController.findAll()
      .then((projects) => {
        return res.status(200).send(projects);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  });
  // -----------------------------------------

  /*
  ** Route to create a project
  */
  app.post("/project", verifyToken, (req, res) => {
    return checkAccess(req)
      .then((teamRole) => {
        const permission = accessControl.can(teamRole.role).createAny("project");
        if (!permission.granted) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }

        return projectController.create(req.user.id, req.body);
      })
      .then((project) => {
        return res.status(200).send(project);
      })
      .catch((error) => {
        if (error.message && error.message.indexOf("401") > -1) {
          return res.status(401).send({ error: "Not authorized" });
        }
        return res.status(400).send(error);
      });
  });
  // -----------------------------------------

  /*
  ** Route to get all the user's projects
  */
  app.get("/project/user", verifyToken, (req, res) => {
    projectController.findByUserId(req.user.id)
      .then((projects) => {
        return res.status(200).send(projects);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  });
  // -----------------------------------------

  /*
  ** Route to get a project by ID
  */
  app.get("/project/:id", verifyToken, (req, res) => {
    // generateChartWorkFlow()
    return checkAccess(req)
      .then((teamRole) => {
        const permission = accessControl.can(teamRole.role).readAny("project");
        if (!permission.granted) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }

        return projectController.findById(req.params.id);
      })
      .then((project) => {
        return res.status(200).send(project);
      })
      .catch((error) => {
        if (error.message === "401") {
          return res.status(401).send({ error: "Not authorized" });
        }
        if (error.message === "404") {
          return res.status(404).send({ error: "Not Found" });
        }
        return res.status(400).send(error);
      });
  });
  // -----------------------------------------

  /*
  ** Route to update a project ID
  */
  app.put("/project/:id", verifyToken, (req, res) => {
    return checkAccess(req)
      .then((teamRole) => {
        const permission = accessControl.can(teamRole.role).updateAny("project");
        if (!permission.granted) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }

        return projectController.update(req.params.id, req.body);
      })
      .then((project) => {
        return res.status(200).send(project);
      })
      .catch((error) => {
        if (error.message === "401") {
          return res.status(401).send({ error: "Not authorized" });
        }
        return res.status(400).send(error);
      });
  });
  // -------------------------------------------

  /*
  ** Route to update a project's Logo
  */
  app.post("/project/:id/logo", verifyToken, (req, res) => {
    let logoPath;

    req.pipe(req.busboy);
    req.busboy.on("file", (fieldname, file, info) => {
      const newFilename = `${nanoid(6)}-${info.filename}`;
      const uploadPath = path.normalize(`${__dirname}/../uploads/${newFilename}`);
      logoPath = `uploads/${newFilename}`;

      file.pipe(fs.createWriteStream(uploadPath));
    });

    req.busboy.on("finish", () => {
      return checkAccess(req)
        .then((teamRole) => {
          const permission = accessControl.can(teamRole.role).updateAny("project");
          if (!permission.granted) {
            return new Promise((resolve, reject) => reject(new Error(401)));
          }

          return projectController.update(req.params.id, { logo: logoPath });
        })
        .then((project) => {
          return res.status(200).send(project);
        })
        .catch((err) => {
          return res.status(400).send(err);
        });
    });
  });
  // -------------------------------------------

  /*
  ** Route to remove a project
  */
  app.delete("/project/:id", verifyToken, (req, res) => {
    return checkAccess(req)
      .then((teamRole) => {
        const permission = accessControl.can(teamRole.role).deleteAny("project");
        if (!permission.granted) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }

        return projectController.remove(req.params.id, req.user.id);
      })
      .then(() => {
        return res.status(200).send({ removed: true });
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  });
  // -------------------------------------------

  /*
  ** Route return a list of projects within a team
  */
  app.get("/project/team/:team_id", verifyToken, (req, res) => {
    return teamController.getTeamRole(req.params.team_id, req.user.id)
      .then((teamRole) => {
        const permission = accessControl.can(teamRole.role).readAny("project");
        if (!permission.granted) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }

        return projectController.getTeamProjects(req.params.team_id);
      })
      .then((projects) => {
        return res.status(200).send(projects);
      })
      .catch((error) => {
        if (error.message === "401") {
          return res.status(401).send({ error: "Not authorized" });
        }
        return res.status(400).send(error);
      });
  });
  // -------------------------------------------

  /*
  ** Route to get a project with a public dashboard
  */
  app.get("/project/dashboard/:brewName", getUserFromToken, (req, res) => {
    let processedProject;
    return projectController.getPublicDashboard(req.params.brewName)
      .then(async (project) => {
        processedProject = _.cloneDeep(project);
        processedProject.setDataValue("password", "");

        if (req.user) {
          // now determine whether to show the dashboard or not
          const teamRole = await teamController.getTeamRole(project.team_id, req.user.id);

          if ((teamRole && teamRole.role)) {
            return res.status(200).send(project);
          }
        }

        if (project.public && !project.passwordProtected) {
          return res.status(200).send(processedProject);
        }

        if (project.public && project.passwordProtected && req.query.pass === project.password) {
          return res.status(200).send(processedProject);
        }

        if (project.public && project.passwordProtected && req.query.pass !== project.password) {
          return res.status(403).send("Enter the correct password");
        }

        if (!project.isPublic) return res.status(401).send("Not authorized to access this page");

        return res.status(400).send("Cannot get the data");
      })
      .catch((error) => {
        if (error && error.message === "404") {
          return res.status(404).send(error);
        }
        return res.status(400).send(error);
      });
  });
  // -------------------------------------------

  /*
  ** Route to generate a dashboard template
  */
  app.post("/project/:id/template/:template", verifyToken, (req, res) => {
    return checkAccess(req)
      .then((teamRole) => {
        const permission = accessControl.can(teamRole.role).createAny("connection");
        if (!permission.granted) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }
        return projectController.generateTemplate(
          req.params.id,
          req.body,
          req.params.template,
        );
      })
      .then((result) => {
        // refresh the charts
        const charts = [];
        result.forEach((r) => {
          charts.push(r.chart);
        });
        refreshChartsApi(req.params.id, charts, req.headers.authorization);

        return res.status(200).send(result);
      })
      .catch((err) => {
        if (err && err.message && `${err.message}`.indexOf("404") > -1) {
          return res.status(404).send(err);
        }
        if (err && err.message && `${err.message}`.indexOf("403") > -1) {
          return res.status(403).send(err);
        }
        return res.status(400).send(err);
      });
  });
  // -------------------------------------------

  return (req, res, next) => {
    next();
  };
};
