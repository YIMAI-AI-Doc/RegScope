import { describe, expect, it } from "vitest";
import { parseQuizQuestionBankMarkdown } from "@/lib/quiz/parser";

const sampleMarkdown = `
# 医药注册法规与模拟考题库（200题）

## 单选题 1

**难度**：简单

**题干**：根据《药品注册管理办法》，药品注册包括哪一项申请？

**选项**：
A. 召回申请
B. 补充申请
C. 广告审查申请
D. 集中采购申请

**标准答案**：B

**法规依据/条款来源**：《药品注册管理办法》第三条。

**简要解析**：药品注册法定范围包括补充申请。

## 单选题 2

**难度**：中等

**题干**：药品注册分类中不包括以下哪项？

**选项**：
A. 中药
B. 化学药
C. 生物制品
D. 医疗器械

**标准答案**：D

**法规依据/条款来源**：《药品注册管理办法》第四条。

**简要解析**：医疗器械属于另一监管类别。

## 判断题 3

**难度**：简单

**题干**：化学药品 1 类是境内外均未上市的创新药。

**标准答案**：正确

**法规依据/条款来源**：《化学药品注册分类及申报资料要求》第一部分。

**简要解析**：这是化学药品 1 类的基本定义。

## 多选题 4

**难度**：中等

**题干**：以下哪些属于法定药品注册事项？

**选项**：
A. 药物临床试验申请
B. 补充申请
C. 再注册申请
D. 广告审查申请

**标准答案**：ABC

**法规依据/条款来源**：《药品注册管理办法》第三条。

**简要解析**：广告审查申请不属于药品注册事项。
`;

describe("parseQuizQuestionBankMarkdown", () => {
  it("parses markdown questions into structured quiz records", () => {
    const questions = parseQuizQuestionBankMarkdown(sampleMarkdown);

    expect(questions).toHaveLength(4);
    expect(questions[0]).toMatchObject({
      sourceNumber: 1,
      sequence: 1,
      typeLabel: "单选题",
      difficultyLabel: "简单",
      prompt: "根据《药品注册管理办法》，药品注册包括哪一项申请？",
      optionB: "补充申请",
      correctOption: "B",
      legalBasis: "《药品注册管理办法》第三条。",
    });
    expect(questions[1].correctOption).toBe("D");
    expect(questions[2]).toMatchObject({
      typeLabel: "判断题",
      optionA: "正确",
      optionB: "错误",
      correctOption: "A",
    });
    expect(questions[3].correctOption).toBe("ABC");
  });
});
