import {getManager, QueryBuilder, Repository, SelectQueryBuilder} from "typeorm";
import {NameValuePair} from "./NameValuePair";
import {StringUtility} from "../../utilities/StringUtility";
import {injectable, unmanaged} from "inversify";

@injectable()
export abstract class AbstractController<T> {
    protected tableName: string;

    protected constructor(@unmanaged() tableName: string) {
        this.tableName = tableName;
    }

    /**
     * Gets the repo.
     */
    protected getRepo(): Repository<T> {
        return getManager().getRepository(this.tableName);
    }

    /**
     * Processes like arguments which can be tricky.
     *
     * @param whereArgs
     * @param likeArgs
     */
    protected getLikeArgs(whereArgs: NameValuePair[], likeArgs: NameValuePair[]): Promise<T[]> {
        let query: SelectQueryBuilder<T> = this.getRepo().createQueryBuilder(this.tableName);
        query = this.createLikeQuery(whereArgs, likeArgs, query, this.tableName);

        return query.getMany()
            .then((objs) => {
                if (objs == null || objs.length < 1) {
                    return null;
                }

                return objs;
            });
    }

    /**
     * Fills the query with appropriate where clauses.
     * @param whereArgs
     * @param likeArgs
     * @param query
     * @param tableName
     */
    protected createLikeQuery (whereArgs: NameValuePair[], likeArgs: NameValuePair[], query: SelectQueryBuilder<any>, tableName: string): SelectQueryBuilder<any> {
        let oneClause = false, i: number, whereQuery: string, pair: NameValuePair, sanitizedValue: string;

        if (whereArgs != null && whereArgs.length > 0) {
            for (i = 0; i < whereArgs.length; i++) {
                pair = whereArgs[i];

                sanitizedValue = StringUtility.escapeMySQLInput(pair.value);
                whereQuery = `\"${tableName}\".\"${pair.name}\" = ${sanitizedValue}`;

                if (!oneClause) {
                    query = query.where(whereQuery);
                    oneClause = true;
                } else {
                    query = query.andWhere(whereQuery);
                }
            }
        }

        if (likeArgs != null && likeArgs.length > 0) {
            for (i = 0; i < likeArgs.length; i++) {
                pair = likeArgs[i];

                sanitizedValue = StringUtility.escapeSQLInput(pair.value);
                whereQuery = `LOWER(\"${tableName}\".\"${pair.name}\") LIKE LOWER('%${sanitizedValue}%')`;

                if (!oneClause) {
                    query = query.where(whereQuery);
                    oneClause = true;
                } else {
                    query = query.andWhere(whereQuery);
                }
            }
        }

        return query;
    }
}