import Response from "../utils/Response.Class.js";
import THQError from "../utils/THQError.Class.js";
import transactionModel from "../models/transaction.model.js";
import errorHelper from "../helpers/error.helper.js";
import productModel from "../models/product.model.js";
import dayjs from "dayjs";
import userIdFromReq from "../helpers/user.helper.js";


async function getStatisticRevenue(req, res) {
    try {
        if (!req.query) {
            throw THQError("Khong co du lieu")
        }
        
    const FIRST_MONTH = 1
    const LAST_MONTH = 12
    const MONTHS_ARRAY = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ]
    let TODAY = req.query.yearString //"2023-04-07T00:00:00"
    let YEAR_BEFORE = req.query.yearBeforeString // "2022-04-07T00:00:00"
    let user_id = userIdFromReq(req)

    const result = await transactionModel.aggregate( [{ 
      $match: {
        user_id: user_id
       }
    },
    { 
        $group: {
            _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
            count: { $sum: "$paymentMoney" }
        } 
    },
    {
        $sort: { "_id.year_month": 1 }
    },
    { 
        $project: { 
            _id: 0, 
            count: 1, 
            month_year: { 
                $concat: [ 
                    { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
                    "-", 
                    { $substrCP: [ "$_id.year_month", 0, 4 ] }
                ] 
            }
        } 
    },
    { 
        $group: { 
            _id: null, 
            data: { $push: { k: "$month_year", v: "$count" } }
        } 
    },
    { 
        $addFields: { 
            start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
            end_year: { $substrCP: [ TODAY, 0, 4 ] },
            months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
            months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
        } 
    },
    { 
        $addFields: { 
            template_data: { 
                $concatArrays: [ 
                    { $map: { 
                        input: "$months1", as: "m1",
                        in: {
                            count: 0,
                            month_year: { 
                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
                            }                                            
                        }
                    } }, 
                    { $map: { 
                        input: "$months2", as: "m2",
                        in: {
                            count: 0,
                            month_year: { 
                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
                            }                                            
                        }
                    } }
                ] 
            }
        }
    },
    { 
        $addFields: { 
            data: { 
                $map: { 
                    input: "$template_data", as: "t",
                    in: {   
                        k: "$$t.month_year",
                        v: { 
                            $reduce: { 
                                input: "$data", initialValue: 0, 
                                in: {
                                    $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                                { $add: [ "$$this.v", "$$value" ] },
                                                { $add: [ 0, "$$value" ] }
                                    ]
                                }
                            } 
                        }
                    }
                }
            }
        }
    },
    {
        $project: { 
            data: { $arrayToObject: "$data" }, 
            _id: 0 
        } 
    }
        ])

    res.status(200).send(new Response(
        true,
        "Thanh cong",
        result
    ))

    } catch (error) {
        errorHelper.sendError(res, getStatisticRevenue, error)
    }
}

async function getCapitalAndRevenue(req, res) {
    try {
        if (!req.query) {
            throw THQError("Khong tim thay du lieu") 
        }
        const FIRST_MONTH = 1
        const LAST_MONTH = 12
        const MONTHS_ARRAY = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ]
        let TODAY = req.query.yearString //"2023-04-07T00:00:00"
        let YEAR_BEFORE = req.query.yearBeforeString // "2022-04-07T00:00:00"
        let user_id = userIdFromReq(req)
    
        const result1 = await transactionModel.aggregate( [{ 
          $match: { 
            user_id: user_id
          }
        },
        { 
            $group: {
                _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
                count: { $sum: "$paymentMoney" }
            } 
        },
        {
            $sort: { "_id.year_month": 1 }
        },
        { 
            $project: { 
                _id: 0, 
                count: 1, 
                month_year: { 
                    $concat: [ 
                        { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
                        "-", 
                        { $substrCP: [ "$_id.year_month", 0, 4 ] }
                    ] 
                }
            } 
        },
        { 
            $group: { 
                _id: null, 
                data: { $push: { k: "$month_year", v: "$count" } }
            } 
        },
        { 
            $addFields: { 
                start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
                end_year: { $substrCP: [ TODAY, 0, 4 ] },
                months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
                months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
            } 
        },
        { 
            $addFields: { 
                template_data: { 
                    $concatArrays: [ 
                        { $map: { 
                            input: "$months1", as: "m1",
                            in: {
                                count: 0,
                                month_year: { 
                                    $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
                                }                                            
                            }
                        } }, 
                        { $map: { 
                            input: "$months2", as: "m2",
                            in: {
                                count: 0,
                                month_year: { 
                                    $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
                                }                                            
                            }
                        } }
                    ] 
                }
            }
        },
        { 
            $addFields: { 
                data: { 
                    $map: { 
                        input: "$template_data", as: "t",
                        in: {   
                            k: "$$t.month_year",
                            v: { 
                                $reduce: { 
                                    input: "$data", initialValue: 0, 
                                    in: {
                                        $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                                    { $add: [ "$$this.v", "$$value" ] },
                                                    { $add: [ 0, "$$value" ] }
                                        ]
                                    }
                                } 
                            }
                        }
                    }
                }
            }
        },
        {
            $project: { 
                data: { $arrayToObject: "$data" }, 
                _id: 0 
            } 
        }
            ])
            const result2 = await transactionModel.aggregate( [{ 
                $match: { }
              },
              { 
                  $group: {
                      _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
                      count: { $sum: "$initialCapital" }
                  } 
              },
              {
                  $sort: { "_id.year_month": 1 }
              },
              { 
                  $project: { 
                      _id: 0, 
                      count: 1, 
                      month_year: { 
                          $concat: [ 
                              { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
                              "-", 
                              { $substrCP: [ "$_id.year_month", 0, 4 ] }
                          ] 
                      }
                  } 
              },
              { 
                  $group: { 
                      _id: null, 
                      data: { $push: { k: "$month_year", v: "$count" } }
                  } 
              },
              { 
                  $addFields: { 
                      start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
                      end_year: { $substrCP: [ TODAY, 0, 4 ] },
                      months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
                      months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
                  } 
              },
              { 
                  $addFields: { 
                      template_data: { 
                          $concatArrays: [ 
                              { $map: { 
                                  input: "$months1", as: "m1",
                                  in: {
                                      count: 0,
                                      month_year: { 
                                          $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
                                      }                                            
                                  }
                              } }, 
                              { $map: { 
                                  input: "$months2", as: "m2",
                                  in: {
                                      count: 0,
                                      month_year: { 
                                          $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
                                      }                                            
                                  }
                              } }
                          ] 
                      }
                  }
              },
              { 
                  $addFields: { 
                      data: { 
                          $map: { 
                              input: "$template_data", as: "t",
                              in: {   
                                  k: "$$t.month_year",
                                  v: { 
                                      $reduce: { 
                                          input: "$data", initialValue: 0, 
                                          in: {
                                              $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                                          { $add: [ "$$this.v", "$$value" ] },
                                                          { $add: [ 0, "$$value" ] }
                                              ]
                                          }
                                      } 
                                  }
                              }
                          }
                      }
                  }
              },
              {
                  $project: { 
                      data: { $arrayToObject: "$data" }, 
                      _id: 0 
                  } 
              }
                  ])
    
        res.status(200).send(new Response(
            true,
            "Thanh cong",
            {
                result1,
                result2,
            }
        ))

    } catch (error) {
        errorHelper.sendError(res, getStatisticTransaction, error)
    }
}

async function getNumberOfTransaction(req, res) {
    try {
        if (!req.query) {
            throw THQError("Khong co du lieu")
        }
        
    const FIRST_MONTH = 1
    const LAST_MONTH = 12
    const MONTHS_ARRAY = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ]
    let TODAY = req.query.yearString //"2023-04-07T00:00:00"
    let YEAR_BEFORE = req.query.yearBeforeString // "2022-04-07T00:00:00"
    let user_id = userIdFromReq(req)

    const result = await transactionModel.aggregate( [{ 
        // filter all results
      $match: { 
        user_id: user_id
      }
    },
    { 
        $group: {
            _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
            count: { $sum: 1 }
        } 
    },
    {
        $sort: { "_id.year_month": 1 }
    },
    { 
        $project: { 
            _id: 0, 
            count: 1, 
            month_year: { 
                $concat: [ 
                    { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
                    "-", 
                    { $substrCP: [ "$_id.year_month", 0, 4 ] }
                ] 
            }
        } 
    },
    { 
        $group: { 
            _id: null, 
            data: { $push: { k: "$month_year", v: "$count" } }
        } 
    },
    { 
        $addFields: { 
            start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
            end_year: { $substrCP: [ TODAY, 0, 4 ] },
            months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
            months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
        } 
    },
    { 
        $addFields: { 
            template_data: { 
                $concatArrays: [ 
                    { $map: { 
                        input: "$months1", as: "m1",
                        in: {
                            count: 0,
                            month_year: { 
                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
                            }                                            
                        }
                    } }, 
                    { $map: { 
                        input: "$months2", as: "m2",
                        in: {
                            count: 0,
                            month_year: { 
                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
                            }                                            
                        }
                    } }
                ] 
            }
        }
    },
    { 
        $addFields: { 
            data: { 
                $map: { 
                    input: "$template_data", as: "t",
                    in: {   
                        k: "$$t.month_year",
                        v: { 
                            $reduce: { 
                                input: "$data", initialValue: 0, 
                                in: {
                                    $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                                { $add: [ "$$this.v", "$$value" ] },
                                                { $add: [ 0, "$$value" ] }
                                    ]
                                }
                            } 
                        }
                    }
                }
            }
        }
    },
    {
        $project: { 
            data: { $arrayToObject: "$data" }, 
            _id: 0 
        } 
    }
        ])

    res.status(200).send(new Response(
        true,
        "Thanh cong",
        result
    ))

    } catch (error) {
        errorHelper.sendError(res, getStatisticRevenue, error)
    }
}

async function getTopSeller(req, res) {
    try {
        if (!req.query) {
            throw THQError("Khong co du lieu")
        }
        let user_id = userIdFromReq(req)
        let result = await productModel.aggregate([
            {
                $match: {
                    user_id: user_id
                }
            },
            {
                $group: {
                    _id : "$id",
                    expiredMilliseconds: {
                        $sum: "$expiredMilliseconds"
                    },
                    
                }
            },
            {
                $sort: {
                    sold: -1
                }
            }
        ])

        var topSeller = []
        for(let i = 0; i < result.length; i++) {
            topSeller[i] = await productModel.findOne({ id: result[i]._id })
        }

        res.status(200).send(new Response(
            true,
            "Thanh cong",
            topSeller
        ))

    } catch (error) {
        errorHelper.sendError(res, getTopSeller, error)
    }
}

async function getTopExpired(req, res) {
    try {
        if (!req) {
            throw THQError("Khong co du lieu")
        }
        let user_id = userIdFromReq(req)

        let result = await productModel.aggregate([
            {
                $match: { 
                    user_id: user_id
                }
            },
            {
                $group: {
                    _id : "$id",
                    miniseconds: {
                        $sum: "$expiredMilliseconds"
                    },
                    
                }
            },
            {
                $sort: {
                    miniseconds: 1
                }
            }
        ])

        var topSeller = []
        for(let i = 0; i < result.length; i++) {
            topSeller[i] = await productModel.findOne({ id: result[i]._id })
        }

        res.status(200).send(new Response(
            true,
            "Thanh cong",
            topSeller
        ))

    } catch (error) {
        errorHelper.sendError(res, getTopExpired, error)
    }
}


export default {
    getStatisticRevenue,
    getCapitalAndRevenue,
    getNumberOfTransaction,
    getTopSeller,
    getTopExpired,
}